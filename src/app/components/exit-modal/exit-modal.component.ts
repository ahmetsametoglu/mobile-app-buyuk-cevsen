import { Component, OnInit } from "@angular/core";
import { BookmarkService } from "src/app/services/bookmark.service";

@Component({
  selector: "app-exit-modal",
  templateUrl: "./exit-modal.component.html",
  styleUrls: ["./exit-modal.component.scss"]
})
export class ExitModalComponent implements OnInit {
  constructor(public bookmarkService: BookmarkService) {}

  ngOnInit() {}
}
