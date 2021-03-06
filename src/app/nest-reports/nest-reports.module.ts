import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NrListComponent } from './nr-list/nr-list.component';
import { NrCrudComponent } from './nr-crud/nr-crud.component';
import { UILibsModule } from '../uilibs/uilibs.module';
import { ServicesModule } from '../services/services.module';
import { MigrationsService } from '../migrations/migrations.service';

@NgModule({
  declarations: [NrListComponent, NrCrudComponent],
  imports: [
    UILibsModule,
    ServicesModule
  ],
  exports: [NrListComponent],
  providers: [
    { provide: MigrationsService, useClass: MigrationsService}
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NestReportsModule { }
