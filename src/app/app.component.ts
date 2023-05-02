import {
  animate,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { slideLeftRoRight, slider } from './route-animations';
import { GetDataService } from './services/get-data.service';
import { DataProvider } from './provider/data-provider.service';
import { PrintingService } from './services/printing.service';
declare var pywebview: any;
declare var jivo_api: any;
declare var jivo_config: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slider],
})
export class AppComponent implements OnInit {
  title = 'Viraj';
  test: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  availableVoices: SpeechSynthesisVoice[] = [];
  selectedVoice: SpeechSynthesisVoice | undefined;
  speechSynthesis: SpeechSynthesis | undefined;
  textToSpeak = 'विराज को 1240 रुपए मिले';
  volume: number = 1;
  rate: number = 0.8;
  pitch: number = 1;

  constructor(
    public dataProvider: DataProvider,
    private dataService: GetDataService,
    private printingService: PrintingService
  ) {
    // console.log("pywebview",window,this.printingService.getPrinters());
    // setInterval(()=>{
    //   this.printingService.printBill()
    // },10000)
    window.addEventListener('load', (data) => {
      console.log(document.querySelector("jdiv[class*='main_']"));
      let chatFinderInterval = setInterval(() => {
        let element = document.getElementById('jcont');
        if (element) {
          let response = jivo_api.setCustomData([
            {
              title: 'User',
              content: this.dataProvider.currentUser?.userId,
              user: {
                name: this.dataProvider.currentUser?.name,
                email: this.dataProvider.currentUser?.email,
                image: this.dataProvider.currentUser?.image,
                business: this.dataProvider.currentUser?.business,
                device: this.dataProvider.currentDevice,
              },
            },
          ]);
          console.log('chat response', response);
          clearInterval(chatFinderInterval);
        }
      }, 500);
    });
  }

  checkPrinting(){
    // printing.print()
  }

  hideChatWindow() {
    console.log(document.querySelector('jdiv'));
  }

  ngOnInit() {
    this.speechSynthesis = window.speechSynthesis;
    this.availableVoices = this.getVoices();
    console.log('Voices', this.availableVoices);

    // this.speak("Hello World");
  }

  getVoices() {
    if (this.speechSynthesis) {
      let voices = this.speechSynthesis.getVoices();
      if (!voices.length) {
        let utterance = new SpeechSynthesisUtterance('');
        speechSynthesis.speak(utterance);
        voices = speechSynthesis.getVoices();
      }
      return voices;
    } else {
      return [];
    }
  }

  speak(text: string, volume: number = 1, rate: number = 1, pitch: number = 1) {
    if (this.selectedVoice) {
      let speakData = new SpeechSynthesisUtterance();
      speakData.volume = volume; // From 0 to 1
      speakData.rate = rate; // From 0.1 to 10
      speakData.pitch = pitch; // From 0 to 2
      speakData.text = text;
      speakData.lang = 'en';
      speakData.voice = this.selectedVoice;
      speechSynthesis.speak(speakData);
    }
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }
}
