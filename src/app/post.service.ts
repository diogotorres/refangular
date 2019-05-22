import { Post } from './post';
import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpEvent } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  public posts: Post[] = [];

  constructor(private http: HttpClient) { 
    this.http.get("/api").subscribe((postsServer: any[]) => {
        for(let p of postsServer) {
          this.posts.push(new Post(p.nome, p.titulo, p.subtitulo, p.email, p.mensagem, p.arquivo, p.id, p.likes));
        }
    });
  }

  salvar(post: Post, file: File){
    //utilizando FormData por causa do arquivo
    const uploadData = new FormData();
    uploadData.append('nome', post.nome);
    uploadData.append('email', post.email);
    uploadData.append('titulo', post.titulo);
    uploadData.append('subtitulo', post.subtitulo);
    uploadData.append('mensagem', post.mensagem);
    uploadData.append('arquivo', file, file.name);

    this.http.post('/api', uploadData, {reportProgress: true, observe: 'events'}).subscribe((event: any) => {
      if(event.type == HttpEventType.Response){
          let p: any = event.body;
          this.posts.push(new Post(p.nome, p.titulo, p.subtitulo, p.email, p.mensagem, p.arquivo, p.id, p.likes));
      }
      //evento de progresso de upload
      if(event.type == HttpEventType.UploadProgress){
        console.log(event);
      }
    });
  }

  like(id: number){
    this.http.get('/api/like/' + id).subscribe((event: any) => {
      //busca um objeto dentro do array que contenha o id selecionado
      let p = this.posts.find((p) => p.id == id); 
      p.likes = event.likes;
    });
  }

  delete(id: number){
    this.http.delete('/api/' + id).subscribe((event) => {
      let i = this.posts.findIndex((p) => p.id == id);
      if(i >= 0){
        this.posts.splice(i, 1);
      }
    });
  }

}
