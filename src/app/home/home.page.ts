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
  private canSendCommand = true;
  private commandDelay = 2000; // Delay dalam milidetik

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
          await this.sendCommand('right 10');
        } else if (angle >= 45 && angle < 135) {
          await this.sendCommand('forward 10');
        } else if (angle >= 135 && angle < 225) {
          await this.sendCommand('left 10');
        } else if (angle >= 225 && angle < 315) {
          await this.sendCommand('backward 10');
        }
      }
    }
  }

  async handleDirectionalJoystick(data: any) {
    if (this.canSendCommand) {
      const angle = data.angle.degree;
      const distance = data.distance;

      if (distance > 20) {
        if (angle >= 315 || angle < 45) {
          await this.sendCommand('moveRight');
        } else if (angle >= 45 && angle < 135) {
          await this.sendCommand('moveUp');
        } else if (angle >= 135 && angle < 225) {
          await this.sendCommand('moveLeft');
        } else if (angle >= 225 && angle < 315) {
          await this.sendCommand('moveDown');
        }
      }
    }
  }

  async sendCommand(command: string) {
    if (this.canSendCommand) {
      console.log(`Sending command: ${command}`);
      await this.telloService.sendCommand('command'); // Memastikan drone masuk ke mode perintah
      this.telloService.sendCommand(command);
      this.canSendCommand = false;
      await new Promise(resolve => setTimeout(resolve, this.commandDelay));
      this.canSendCommand = true;
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
