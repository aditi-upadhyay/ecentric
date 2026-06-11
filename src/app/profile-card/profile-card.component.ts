import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent {
  @Input() role: string = 'LEAD DEVELOPER';
  @Input() name: string = 'Aditi Upadhyay';
  @Input() portfolioUrl: string = 'https://aditibupadhyay.netlify.app/';
  @Input() linkedinUrl: string = 'https://www.linkedin.com/in/aditiupadhyay17/';
}
