import { PostService } from './post.service';
import { PostDialogComponent } from './post-dialog/post-dialog.component';
import { Post } from './post';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'refangular';
  
  private posts: Post[];

constructor(
  public dialog: MatDialog,
  public postService: PostService) {}

  ngOnInit(){
    this.posts = this.postService.posts;
  }

  openDialog(){
    const dialogRef = this.dialog.open(PostDialogComponent, {width: '600px'})
    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        this.postService.salvar(result.post, result.arquivo);
      }
    });
  }


}
