import { Component, AfterViewInit } from '@angular/core';
import { TelloService } from '../services/tello.service';
import * as nipplejs from 'nipplejs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  movementJoystick: any;
  directionalJoystick: any;
  private speed = 50; // Kecepatan gerakan drone
  private canSendCommand = true;

  constructor(private telloService: TelloService) {}

  ngAfterViewInit() {
    this.initJoysticks();
  }

  initJoysticks() {
    const movementZone = document.getElementById('movement-joystick');
    const directionalZone = document.getElementById('directional-joystick');

    if (movementZone && directionalZone) {
      this.movementJoystick = nipplejs.create({
        zone: movementZone,
        mode: 'static',
        position: { left: '50%', bottom: '62px' },
        color: 'red',
        size: 125,
      });

      this.directionalJoystick = nipplejs.create({
        zone: directionalZone,
        mode: 'static',
        position: { left: '50%', bottom: '62px' },
        color: 'blue',
        size: 125,
      });

      this.movementJoystick.on('move', (_evt: any, data: any) => {
        this.handleMovementJoystick(data);
      });

      this.directionalJoystick.on('move', (_evt: any, data: any) => {
        this.handleDirectionalJoystick(data);
      });

      this.movementJoystick.on('end', () => this.sendCommand('rc 0 0 0 0'));
      this.directionalJoystick.on('end', () => this.sendCommand('rc 0 0 0 0'));
    } else {
      console.error('Joystick elements not found');
    }
  }

  async handleMovementJoystick(data: any) {
    if (this.canSendCommand) {
      const angle = data.angle.degree;
      const distance = data.distance;

      if (distance > 20) {
        if (angle >= 315 || angle < 45) {
          await this.sendCommand(`rc ${this.speed} 0 0 0`); // Maju
        } else if (angle >= 45 && angle < 135) {
          await this.sendCommand(`rc 0 ${this.speed} 0 0`); // Kiri
        } else if (angle >= 135 && angle < 225) {
          await this.sendCommand(`rc ${-this.speed} 0 0 0`); // Mundur
        } else if (angle >= 225 && angle < 315) {
          await this.sendCommand(`rc 0 ${-this.speed} 0 0`); // Kanan
        }
      } else {
        await this.sendCommand('rc 0 0 0 0'); // Hentikan gerakan
      }
    }
  }

  async handleDirectionalJoystick(data: any) {
    if (this.canSendCommand) {
      const angle = data.angle.degree;
      const distance = data.distance;

      if (distance > 20) {
        if (angle >= 315 || angle < 45) {
          await this.sendCommand(`rc 0 0 ${this.speed} 0`); // Naik
        } else if (angle >= 45 && angle < 135) {
          await this.sendCommand(`rc 0 0 ${-this.speed} 0`); // Turun
        } else if (angle >= 135 && angle < 225) {
          await this.sendCommand(`rc 0 0 0 ${this.speed}`); // Putar Kiri
        } else if (angle >= 225 && angle < 315) {
          await this.sendCommand(`rc 0 0 0 ${-this.speed}`); // Putar Kanan
        }
      } else {
        await this.sendCommand('rc 0 0 0 0'); // Hentikan gerakan
      }
    }
  }

  async sendCommand(command: string) {
    if (this.canSendCommand) {
      console.log(`Sending command: ${command}`);
      await this.telloService.sendCommand('command'); // Memastikan drone masuk ke mode perintah
      this.telloService.sendCommand(command);
    }
  }

  async takeOff() {
    console.log('Take Off command sent');
    await this.sendCommand('takeoff');
  }

  async land() {
    console.log('Land command sent');
    await this.sendCommand('land');
  }
}
