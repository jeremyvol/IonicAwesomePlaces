import { Place } from '../../models/place';
import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { AddPlacePage } from '../add-place/add-place';
import { PlacesService } from '../../services/places';
import { PlacePage } from '../place/place';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    addPlacePage = AddPlacePage;
    places: Place[] = [];

    constructor(
        private modalCtrl: ModalController,
        private placesService: PlacesService
    ) {}

    ionViewWillEnter() {
        this.places = this.placesService.loadPlaces();
        console.log(this.places);
    }

    onOpenPlace(place: Place, index: number) {
        const modal = this.modalCtrl.create(PlacePage, { place, index });
        modal.present();
    }
}
