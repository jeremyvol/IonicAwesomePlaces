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

import { SetLocationPage } from '../set-location/set-location';
import { PlacesService } from '../../services/places';

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
        private camera: Camera
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
                this.imageUrl = imageData;
            },
            err => {
                console.log(err);
            }
        );
    }
}
