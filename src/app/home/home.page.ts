import { Component } from '@angular/core';
import { TelloService } from '../services/udp.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private telloService: TelloService) {}

  ionViewDidEnter() {
    // Contoh perintah untuk memulai komunikasi dengan Tello
    this.telloService.sendCommand('command');
  }

  takeOff() {
    this.telloService.sendCommand('takeoff');
  }

  land() {
    this.telloService.sendCommand('land');
  }

  sendCommand(command: string) {
    this.telloService.sendCommand(command);
  }
}
