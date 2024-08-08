import { Component, AfterViewInit } from '@angular/core';
import { TelloService } from '../services/udp.service';
import * as nipplejs from 'nipplejs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  movementJoystick: any;
  directionalJoystick: any;
  movementInterval: any;
  directionalInterval: any;
  speed = 50;

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

      this.movementJoystick.on('end', () => {
        this.stopMovement();
      });

      this.directionalJoystick.on('move', (_evt: any, data: any) => {
        this.handleDirectionalJoystick(data);
      });

      this.directionalJoystick.on('end', () => {
        this.stopDirectional();
      });
    } else {
      console.error('Joystick elements not found');
    }
  }

  handleMovementJoystick(data: any) {
    const angle = data.angle.degree;

    clearInterval(this.movementInterval);

    this.movementInterval = setInterval(() => {
      if (angle >= 315 || angle < 45) {
        this.sendCommand(`rc ${this.speed} 0 0 0`); // Kanan
      } else if (angle >= 45 && angle < 135) {
        this.sendCommand(`rc 0 ${this.speed} 0 0`); // Maju
      } else if (angle >= 135 && angle < 225) {
        this.sendCommand(`rc -${this.speed} 0 0 0`); // Kiri
      } else if (angle >= 225 && angle < 315) {
        this.sendCommand(`rc 0 -${this.speed} 0 0`); // Mundur
      }
    }, 100);
  }

  handleDirectionalJoystick(data: any) {
    const angle = data.angle.degree;

    clearInterval(this.directionalInterval);

    this.directionalInterval = setInterval(() => {
      if (angle >= 315 || angle < 45) {
        this.sendCommand(`rc 0 0 0 ${this.speed}`); // Putar Kanan
      } else if (angle >= 45 && angle < 135) {
        this.sendCommand(`rc 0 0 ${this.speed} 0`); // Naik
      } else if (angle >= 135 && angle < 225) {
        this.sendCommand(`rc 0 0 0 -${this.speed}`); // Putar Kiri
      } else if (angle >= 225 && angle < 315) {
        this.sendCommand(`rc 0 0 -${this.speed} 0`); // Turun
      }
    }, 100);
  }

  stopMovement() {
    clearInterval(this.movementInterval);
    this.sendCommand('rc 0 0 0 0');
  }

  stopDirectional() {
    clearInterval(this.directionalInterval);
    this.sendCommand('rc 0 0 0 0');
  }

  sendCommand(command: string) {
    console.log(`Sending command: ${command}`);
    this.telloService.sendCommand(command);
  }

  takeOff() {
    console.log('Take Off command sent');
    this.sendCommand('takeoff');
  }

  land() {
    console.log('Land command sent');
    this.sendCommand('land');
  }
}
