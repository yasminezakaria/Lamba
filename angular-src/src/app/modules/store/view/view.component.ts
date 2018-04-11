import {Component, OnInit} from '@angular/core';
import {StoreService} from '../../../services/store.service';
import {Router} from "@angular/router";
import * as $ from 'jquery';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  itemsCount: number; // Total number of items
  limit: number; // Number of items per page
  curPage: number; // Number of the current page
  lastPageNumber: number;

  // TODO create item interface ?
  items: any[]; // Current items
  pages: any[]; // Holds the numbers of the pages available to be picked


  constructor(private StoreService: StoreService,
              private router: Router) {
    this.limit = 20;
    this.curPage = 1;
    this.getItemCount();
  }

  ngOnInit() {
  }

  getItemCount() {
    this.StoreService.itemsCount().subscribe((data: any) => {
      this.itemsCount = data.data;
      this.lastPageNumber = Math.ceil(this.itemsCount / this.limit);
      this.loadPageBar(this.curPage);
    });
  }

  loadPage(page: number) {
    this.curPage = page;
    if (this.curPage == -1)
      this.curPage = this.lastPageNumber;
    this.loadPageBar(this.curPage);
    this.loadItems();
  }

  loadPageBar(page: number) {
    // The number of the first page relative to current page
    let min: number = 1 > this.curPage - 3 ? 1 : this.curPage - 3;
    // The number of the last page relative to current page
    let max: number = this.lastPageNumber < this.curPage + 3 ? this.lastPageNumber : this.curPage + 3;


    this.pages = new Array<number>(max - min + 1);

    console.log(this.pages);
    console.log("min: " + min + " max: " + max);
    console.log("lastPageNumber: " + this.lastPageNumber + " curPage: " + this.curPage);

    for (let i = min, j: number = 0; i <= max; i++, j++) {
      this.pages[j] = i;
    }
    this.loadItems();
  }


  loadItems() {
    this.StoreService.viewItems(this.limit, this.curPage).subscribe((data: any) => {
      this.items = data.data;
      console.log(this.items);
    });
  }

  likeItems(item) {
    console.log(item);
    this.StoreService.likeItems(item).subscribe((data: any) => {
      console.log('what');
      console.log(data);
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i]._id == data._id) {
          this.items[i].likes_user_id = data.likes_user_id;
        }
      }
    });
  }

  unlikeItems(item) {
    this.StoreService.unlikeItems(item).subscribe((data: any) => {
      this.items = data.data;
    });
  }

  viewInfo(_id) {
    console.log("awfawf");
    this.router.navigate(['/store/view/' + _id]);
  }
}
