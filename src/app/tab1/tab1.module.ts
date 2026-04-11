import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Tab1Page } from './tab1.page';
import { TaskItemComponent } from './task-item.component';

import { Tab1PageRoutingModule } from './tab1-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ScrollingModule,
    Tab1PageRoutingModule
  ],
   declarations: [Tab1Page, TaskItemComponent]
})
export class Tab1PageModule {}
