import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private router: Router) { }

  // Toggle the mobile menu
  toggleMenu() {
    const navLinks = document.querySelector('.nav-links') as HTMLElement;
    if (navLinks) {
      navLinks.classList.toggle('active');
    }
  }

  showPurchaseSection = (): void => {
    const purchaseSection = document.getElementById('purchase');
    if (purchaseSection) {
      purchaseSection.style.display = 'block'; // Make the purchase section visible
      purchaseSection.scrollIntoView({ behavior: 'smooth' }); // Scroll to it
    }
  }

  // Prevent page reload and scroll to the specified section
  scrollToSection(event: Event, section: string) {
    event.preventDefault();  // Prevent the default anchor link behavior (page reload)

    if (section !== 'purchase') {
      const target = document.getElementById(section);
      if (target) {
        // Scroll smoothly to the target section
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If section is "purchase", show the Purchase Now form
      const purchaseSection = document.getElementById('purchase');
      if (purchaseSection) {
        purchaseSection.style.display = 'block'; // Make the purchase section visible
        purchaseSection.scrollIntoView({ behavior: 'smooth' }); // Scroll to it
      }
    }

    if (section == 'login') {
      this.router.navigate(['/login']);
    }
  }


  products: any[] = [];
  isModalOpen = false;  // Controls the modal visibility

  // Method to add a new product (form)
  addNewProduct() {
    this.products.push({
      productName: '',
      quantity: '',
      message: ''
    });
  }

  // Method to remove a product (form)
  removeProduct(index: number) {
    this.products.splice(index, 1);
  }

  // Handle form submission
  onSubmit(product: any): void {
    console.log('Form submitted:', product);
    this.products.push({
      productName: product.productName,
      quantity: product.quantity,
      message: product.message
    });

    // Optionally reset the form fields here
    product.productName = '';
    product.quantity = '';
    product.message = '';
  }

  // Method to open the modal (View Purchase Items)
  openPurchaseModal() {
    this.isModalOpen = true;
  }

  // Method to close the modal
  closePurchaseModal() {
    this.isModalOpen = false;
  }


}
