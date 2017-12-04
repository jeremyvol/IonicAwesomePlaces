import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
    LoadingController,
    ModalController,
    ToastController
} from 'ionic-angular';

import { Location } from '../../models/location';

import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File, Entry, FileError } from '@ionic-native/file';

import { SetLocationPage } from '../set-location/set-location';
import { PlacesService } from '../../services/places';

declare var cordova: any;

@Component({
    selector: 'page-add-place',
    templateUrl: 'add-place.html'
})
export class AddPlacePage {
    location: Location = {
        lat: 40.7624324,
        lng: -73.9759827
    };
    locationIsSet = false;
    imageUrl = '';

    constructor(
        private modalCtrl: ModalController,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
        private placesService: PlacesService,
        private geolocation: Geolocation,
        private camera: Camera,
        private file: File
    ) {}

    onSubmit(form: NgForm) {
        this.placesService.addPlace(
            form.value.title,
            form.value.description,
            this.location,
            this.imageUrl
        );
        form.reset();
        this.location = {
            lat: 40.7624324,
            lng: -73.9759827
        };
        this.imageUrl = '';
        this.locationIsSet = false;
    }

    onOpenMap() {
        const modal = this.modalCtrl.create(SetLocationPage, {
            location: this.location,
            isSet: this.locationIsSet
        });
        modal.present();
        modal.onDidDismiss(data => {
            if (data) {
                this.location = data.location;
                this.locationIsSet = true;
            }
        });
    }

    onLocate() {
        const loading = this.loadingCtrl.create({
            content: 'Getting your location...'
        });
        loading.present();

        this.geolocation
            .getCurrentPosition()
            .then(resp => {
                loading.dismiss();
                this.location.lat = resp.coords.latitude;
                this.location.lng = resp.coords.longitude;
                this.locationIsSet = true;
            })
            .catch(error => {
                loading.dismiss();
                const toast = this.toastCtrl.create({
                    message: 'could not get location, please pick it manually.',
                    duration: 2500
                });
                toast.present();
            });
    }

    onTakePhoto() {
        const options: CameraOptions = {
            quality: 100,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true
        };
        this.camera.getPicture(options).then(
            imageData => {
                const currentName = imageData.replace(/^.*[\\\/]/, '');
                const path = imageData.replace(/[^\/]*$/, '');
                const newFileName = new Date().getUTCMilliseconds() + '.jpg';
                this.file
                    .moveFile(
                        path,
                        currentName,
                        cordova.file.dataDirectory,
                        newFileName
                    )
                    .then((data: Entry) => {
                        this.imageUrl = data.nativeURL;
                        this.camera.cleanup();
                    })
                    .catch((err: FileError) => {
                        this.imageUrl = '';
                        const toast = this.toastCtrl.create({
                            message:
                                'Could not save the image. Pleae try again.',
                            duration: 2500
                        });
                        toast.present();
                        this.camera.cleanup();
                    });
                this.imageUrl = imageData;
            },
            err => {
                const toast = this.toastCtrl.create({
                    message: 'Could not take the image. Pleae try again.',
                    duration: 2500
                });
                toast.present();
            }
        );
    }
}
