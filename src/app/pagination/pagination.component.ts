import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() items!: any[];
  itemsPerPage: number = 6
  @Output() pageChange = new EventEmitter<any[]>();

  currentPage = 1;

  get totalPages(): number {
    return Math.ceil(this.items.length / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      const startIndex = (page - 1) * this.itemsPerPage;
      const endIndex = Math.min(startIndex + this.itemsPerPage, this.items.length);
      const pageItems = this.items.slice(startIndex, endIndex);
      this.pageChange.emit(pageItems);
    }
  }
}
