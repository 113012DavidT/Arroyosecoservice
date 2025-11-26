import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalService, ConfirmModalData } from '../services/confirm-modal.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent implements OnInit {
  modal$: Observable<ConfirmModalData | null>;

  constructor(private modalService: ConfirmModalService) {
    this.modal$ = modalService.modal$;
  }

  ngOnInit(): void {}

  confirm() {
    this.modalService.resolve(true);
  }

  cancel() {
    this.modalService.resolve(false);
  }
}
