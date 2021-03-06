import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SpawnPoint } from './models/spawn-point';
import { StoreService } from '../services/store.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class SpawnPointsService {
  static cachedSpawnPoints: SpawnPoint[];
  static id: number = 100;
  constructor(private http: HttpClient, private store: StoreService) { }

  getSpawnPointList() {
    return this.http.get('/assets/spawnpoints.json')
      .toPromise()
      .then(result => <SpawnPoint[]>result)
      .then(data => {
        if (!this.store.read('spawnPoints')) {
          this.store.save('spawnPoints', data);
        }

        if (data !== this.store.read('spawnPoints')) {
          const storeData = this.store.read('spawnPoints');

          return storeData;
        }

        return data;
      });
  }

  newSpawnPoint(point: SpawnPoint, messageService?: MessageService) {
    return this.http.post('https://jsonplaceholder.typicode.com/todos/', point)
      .toPromise()
      .catch(err => {
        console.log(err);

        if (!!messageService) {
          messageService.add({ severity: 'error', summary: 'No se pudo completar la operación', detail: err.toString().substr(130)});
        }
      })
      .then(() => {
        if (SpawnPointsService.id) {
          point.pointId = ''+(++SpawnPointsService.id);
        }

        this.store.save('spawnPoints', point);

        if (!!messageService) {
          messageService.add({ severity: 'success', summary: 'Operación completada', detail: `Spawn Point "${name}" agregado!`});
        }
        if (SpawnPointsService.cachedSpawnPoints) {
          SpawnPointsService.cachedSpawnPoints.push(point);
        }
      });
  }

  getSpawnPoint(pointId: string) {
    return this.http.get('https://jsonplaceholder.typicode.com/todos/' + pointId)
      .toPromise()
      .then((returnValue) => {
        const spawnPoint = this.store.read('spawnPoints', {itemId: pointId, propertyId: 'pointId'});

        if (!!spawnPoint) {
          return spawnPoint;
        }

        return false;
      });
    }

    editSpawnPoint(pointId: string, values: any, messageService: MessageService) {
      return this.http.put('https://jsonplaceholder.typicode.com/todos/' + pointId, values)
        .toPromise()
        .then(() => {
          const spawnPoints = this.store.read('spawnPoints');
          let found = -1;

          spawnPoints.forEach((point: SpawnPoint, index: number) => {
            if (point.pointId === pointId) {
              found = index;
            }
          });

          if (found > -1) {
            if (spawnPoints[found]) {
              values.pointId = pointId;
              spawnPoints[found] = values;
            }
            
            this.store.save('spawnPoints', spawnPoints);

            if (!!messageService) {
              messageService.add({ severity: 'success', summary: 'Edición completada', detail: `Spawn point "${values.name}" editado!`});
            }
          }
        });
    }
}
