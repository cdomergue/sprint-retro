import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PostIt, PostItType } from '../post-it/post-it.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'mle-retro-board',
  templateUrl: './retro-board.component.html',
  styleUrls: ['./retro-board.component.scss']
})
export class RetroBoardComponent implements OnInit {

  private postIts;
  private maxVote = 3;
  private export :boolean = false;

  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    this.loadPostIts();
  }

  loadPostIts() {
    this.http.get(environment.apiUrl + '/post-its').subscribe(response => {
      this.postIts = response;
    });
  }

  getPostItComments(type: PostItType) {
    let result = this.postIts && this.postIts[type] ? this.postIts[type] : [];
    return result.sort((postItA, postItB) => {return postItB.vote - postItA.vote});
  }

  refresh() {
    this.loadPostIts();
  }

  voteUpPostIt(type: PostItType, id: string) {
    if(this.maxVote) {
      this.maxVote--;
      this.http.post(environment.apiUrl + '/vote', {type, id}).subscribe(() => {});
    }
  }

  exportLowCost() {
    this.export = !this.export;
  }

  notifyPostItOnBoard(postIt: PostIt) {
    if(this.postIts) {
      const findIndex = this.postIts[postIt.type].findIndex(val => val.id == postIt.id);
      if(findIndex != -1) {
        this.postIts[postIt.type][findIndex] = postIt;
      } else {
        this.postIts[postIt.type].unshift(postIt);
      }
    }else {
      this.loadPostIts();
    }
  }
}
