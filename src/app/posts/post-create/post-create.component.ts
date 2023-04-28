import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { Post } from "../post.model";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
// import { mimeType } from "./mime-type.validator";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit, OnDestroy {

    enteredContent ='';
    enteredTitle ='';
    private mode = 'create'
    private posstId: any
    post!: Post
    isLoading = false
    form!: FormGroup
    fileData:any
    imageUrl: any
    private authStatusSub!: Subscription

    constructor(public service: PostsService, public route: ActivatedRoute, private authService : AuthService) {}

    ngOnInit() {
        this.authStatusSub = this.authService.getAuthStatus().subscribe(isAuthenticated => {
            this.isLoading = false
        })

        this.form = new FormGroup({
            title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
            content: new FormControl(null, {validators: [Validators.required]}),
            image: new FormControl(null, {validators: [Validators.required]
                // asyncValidators: [mimeType]
            })
        })

        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if(paramMap.has('postId')){
                this.mode = 'edit';
                this.posstId = paramMap.get('postId')
                this.isLoading = true
                this.service.getPost(this.posstId).subscribe(res => {
                    this.isLoading = false
                    this.post = res
                    this.form.setValue({title: this.post.title, content: this.post.content,image: this.post.imagePath})
                })
            } else {
                this.mode = 'create'
                this.posstId = null
            }
        })
    }
    
    onAddPost(){
        if(this.form.value.invalid){
            return
        }        
        this.isLoading = true
        if(this.mode === "create"){
            this.service.addPost(this.form.value.title, this.form.value.content, this.form.value.image)
        } else {          
            this.service.updatePost(this.posstId,this.form.value.title, this.form.value.content,this.form.value.image)
        }
        this.form.reset();
    }

    onImagePicked(event: Event){
        this.fileData = (event.target as HTMLInputElement).files
        const file = this.fileData[0]
        this.form.patchValue({image: file});
        this.form.get('image')?.updateValueAndValidity()
        const reader = new FileReader();
        reader.onload = () => {
            this.imageUrl = reader.result;
        }
        reader.readAsDataURL(file)
        // console.log(this.form);
        // console.log(file);        
    }

    ngOnDestroy() {
        this.authStatusSub.unsubscribe()
    }
}