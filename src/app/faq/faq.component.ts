import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
  assetPath(path: string): string {
    return `./${path}`;
  }

  faqs = [
    {
      id: 1,
      question: 'What is Elec Tricks?',
      answer: 'Elec Tricks is a platform designed to simplify electricity billing among tenants and promote sustainable living. It helps distribute electricity costs fairly based on usage.'
    },
    {
      id: 2,
      question: 'How does Elec Tricks work?',
      answer: 'Elec Tricks uses advanced algorithms to calculate electricity bills accurately. It records individual usage and distributes costs fairly among tenants, ensuring transparency.'
    },
    {
      id: 3,
      question: 'Why should I use Elec Tricks?',
      answer: 'Elec Tricks eliminates disputes over electricity bills and encourages responsible energy consumption. It promotes unity among tenants by ensuring everyone pays their fair share.'
    },
    {
      id: 4,
      question: 'Is my data safe with Elec Tricks?',
      answer: 'Yes, your data is absolutely safe with Elec Tricks. We prioritize your privacy and security. We do not store any of your information, not even on your local device. Rest assured that your data remains entirely confidential and is never at risk. Your peace of mind is our top priority.'
    }
  ]
}
