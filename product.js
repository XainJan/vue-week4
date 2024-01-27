import {createApp} from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
       let productModal = null;
       let delProductModal =null;
       let editProductModal =null;
       const app =createApp({
        data(){
          return{
            url:'https://ec-course-api.hexschool.io/',
            path:'xain',
            tempDelProduct:{},
            products:{},
            pagination:{},
            isModalVisible:false,
            tempProduct:{
              data:{
                title: "",
                category: "",
                origin_price: "",
                price: "",
                unit: "",
                description: "",
                content: "",
                is_enabled: "",
                imageUrl: "",
                imagesUrl: []
              }
            }

          }  
        },
        methods:{
          checkUser(){
            const token = document.cookie.replace(
              /(?:(?:^|.*;\s*)xainToken\s*\=\s*([^;]*).*$)|^.*$/,
              "$1",
            );
            axios.defaults.headers.common['Authorization'] = token;
            const api = `${this.url}v2/api/user/check`
            axios.post(api)
            .then(res => {
             this.getProduct()
            })
            .catch(err => {
              window.location = 'signin.html'
            })
          },
          getProduct(item = 1){
            const api =`${this.url}v2/api/${this.path}/admin/products?page=${item}`
            axios.get(api)
            .then(res => {
               
              const {products,pagination} = res.data 
              this.products = products
              this.pagination= pagination
              
              
            })
            .catch(err => {
              alert(err)
            })
          },
          openModal() {
            editProductModal.show();
            this.isModalVisible = true
          },
          hideModal() {
            editProductModal.hide();
            this.isModalVisible = false
           
          },
          clearForm(){
            this.tempProduct={
              data:{
                title: "",
                category: "",
                origin_price: "",
                price: "",
                unit: "",
                description: "",
                content: "",
                is_enabled: "",
                imageUrl: "",
                imagesUrl: []
              }
            }
          }, 
          addImages(){
            this.tempProduct.data.imagesUrl= []
            this.tempProduct.data.imagesUrl.push('')
          }, 
          checkDelProduct(item){
            this.tempDelProduct = { ...item }
            delProductModal.show()            
            
          },
         
          editProduct(item){
            this.tempProduct.data = { ...item }
            if (!this.tempProduct.data.imagesUrl){
              this.tempProduct.data.imagesUrl = []
            }
            this.openModal()
            
          },
         
          

          

        },
        watch:{
            isModalVisible(item){
              if(!item){
                  this.clearForm()
                 
              }
            }
        },
        mounted(){
          
          delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
          keyboard: false,
          backdrop: 'static'
        });
          
          
          this.checkUser()
        }
        
       });
       //新增產品元件
       app.component('productModal',{
        props:['item','clearForm','page'],
        data(){
            return{
                url:'https://ec-course-api.hexschool.io/',
                path:'xain',
                
            }
        },
        methods:{
            upProduct(){
                const api = `${this.url}v2/api/${this.path}/admin/product`
                axios.post(api , this.item)
                .then(res => {
                  
                  this.$emit('getProduct',this.page.current_page)
                  this.$emit('clearForm')
                  alert('建立成功')
                  productModal.hide();
                })
                .catch(err => {
                  alert(err)
                })
              },
              addImages(){
                this.item.data.imagesUrl= []
                this.item.data.imagesUrl.push('')
              }, 
             
        },
       
        mounted(){
            productModal = new bootstrap.Modal(document.getElementById('productModal'), {
                keyboard: false,
                backdrop: 'static'
            });
        },
        template:`<div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
        aria-hidden="true">
          <div class="modal-dialog modal-xl">
            <div class="modal-content border-0">
              <div class="modal-header bg-dark text-white">
                <h5 id="productModalLabel" class="modal-title">
                  <span>新增產品</span>
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="col-sm-4">
                    <div class="mb-2">
                      <div class="mb-3">
                        <label for="imageUrl" class="form-label">輸入圖片網址</label>
                        <input type="text" class="form-control"
                              placeholder="請輸入圖片連結" v-model="item.data.imageUrl">
                      </div>
                      <img class="img-fluid" :src="item.data.imageUrl" alt="">
                    </div>

                    <div class="mb-2" v-if="item.data.imagesUrl.length > 0">
                      <div class="mb-3" v-for="(image,index) in item.data.imagesUrl" :key="index" >
                        <div>
                          <label for="imageUrl" class="form-label">輸入圖片網址</label>
                          <input type="text" class="form-control"
                                placeholder="請輸入圖片連結" v-model="item.data.imagesUrl[index]">
                        </div>
                        <img class="img-fluid" :src="item.data.imagesUrl[index]" alt="">
                      </div>
                    
                      <div v-if="item.data.imagesUrl[item.data.imagesUrl.length-1]">
                        <button class="btn btn-outline-primary btn-sm d-block w-100"  @click="item.data.imagesUrl.push('')">
                          新增圖片
                        </button>
                      </div>
                      <div v-else>
                        <button class="btn btn-outline-danger btn-sm d-block w-100" @click="item.data.imagesUrl.pop()">
                          刪除圖片
                        </button>
                      </div>
                    </div>
                    <div v-else>
                      <button class="btn btn-outline-primary btn-sm d-block w-100 " @click="addImages">
                        新增圖片
                      </button>
                    </div>
                  </div>
                  <div class="col-sm-8">
                    <div class="mb-3">
                      <label for="title" class="form-label">標題</label>
                      <input id="title" type="text" class="form-control" placeholder="請輸入標題" v-model="item.data.title">
                    </div>

                    <div class="row">
                      <div class="mb-3 col-md-6">
                        <label for="category" class="form-label">分類</label>
                        <input id="category" type="text" class="form-control"
                              placeholder="請輸入分類" v-model="item.data.category">
                      </div>
                      <div class="mb-3 col-md-6">
                        <label for="price" class="form-label">單位</label>
                        <input id="unit" type="text" class="form-control" placeholder="請輸入單位" v-model="item.data.unit">
                      </div>
                    </div>

                    <div class="row">
                      <div class="mb-3 col-md-6">
                        <label for="origin_price" class="form-label">原價</label>
                        <input id="origin_price" type="number" min="0" class="form-control" placeholder="請輸入原價" v-model.number="item.data.origin_price">
                      </div>
                      <div class="mb-3 col-md-6">
                        <label for="price" class="form-label">售價</label>
                        <input id="price" type="number" min="0" class="form-control"
                              placeholder="請輸入售價" v-model.number="item.data.price">
                      </div>
                    </div>
                    <hr>

                    <div class="mb-3">
                      <label for="description" class="form-label">產品描述</label>
                      <textarea id="description" type="text" class="form-control"
                                placeholder="請輸入產品描述" v-model="item.data.description">
                      </textarea>
                    </div>
                    <div class="mb-3">
                      <label for="content" class="form-label">說明內容</label>
                      <textarea id="description" type="text" class="form-control"
                                placeholder="請輸入說明內容" v-model="item.data.content">
                      </textarea>
                    </div>
                    <div class="mb-3">
                      <div class="form-check">
                        <input id="is_enabled" class="form-check-input" type="checkbox"
                              :true-value="1" :false-value="0" v-model="item.data.is_enabled">
                        <label class="form-check-label" for="is_enabled">是否啟用</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                  取消
                </button>
                <button type="button" class="btn btn-primary" @click="upProduct">
                  確認
                </button>
              </div>
            </div>
          </div>
        </div>`

       })
       //刪除產品元件
       app.component('delProductModal',{
        props:['del','page'],
        data(){
            return{
            url:'https://ec-course-api.hexschool.io/',
            path:'xain',
            }
        },
        methods:{
            delProduct(){
                const api = `${this.url}v2/api/${this.path}/admin/product/${this.del.id}`;
                
                axios.delete(api)
                .then(res => {
                  delProductModal.hide()
                  this.$emit('getProduct',this.page.current_page)
                })
                .catch(err =>{
                  alert(err)
                })
              },
        },
        mounted(){
           
        },
        template:`<div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1"
        aria-labelledby="delProductModalLabel" aria-hidden="true">
       <div class="modal-dialog">
         <div class="modal-content border-0">
           <div class="modal-header bg-danger text-white">
             <h5 id="delProductModalLabel" class="modal-title">
               <span>刪除產品</span>
             </h5>
             <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
           </div>
           <div class="modal-body">
             是否刪除
             <strong class="text-danger"></strong> 商品(刪除後將無法恢復)。
           </div>
           <div class="modal-footer">
             <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
               取消
             </button>
             <button type="button" class="btn btn-danger" @click="delProduct">
               確認刪除
             </button>
           </div>
         </div>
       </div>`
       })
       //編輯產品元件
       app.component('editProductModal',{
        props:['edit',],
        data(){
            return{
            url:'https://ec-course-api.hexschool.io/',
            path:'xain',
           
            }
            
        },
        methods:{
            putProduct(){
                const api = `${this.url}v2/api/${this.path}/admin/product/${this.edit.data.id}`
                axios.put(api, this.edit)
                .then(res => {
                  alert('編輯成功')
                  
                  this.$emit('getProduct')
                  this.$emit('hideModal')
    
    
                })
                .catch(err => {
                  alert(err)
                })
                
                
              },
              addImages(){
                this.edit.data.imagesUrl= []
                this.edit.data.imagesUrl.push('')
              }, 
            
        },
        

        mounted(){
        
              editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'), {
                keyboard: false,
                backdrop: 'static'
            });
        },
        template:`<div id="editProductModal" ref="editproductModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
        aria-hidden="true">
         <div class="modal-dialog modal-xl">
           <div class="modal-content border-0">
             <div class="modal-header bg-dark text-white">
               <h5 id="productModalLabel" class="modal-title">
                 <span>編輯產品</span>
               </h5>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="clearForm"></button>
             </div>
             <div class="modal-body">
               <div class="row">
                 <div class="col-sm-4">
                   <div class="mb-2">
                     <div class="mb-3">
                       <label for="imageUrl" class="form-label">輸入圖片網址</label>
                       <input type="text" class="form-control"
                             placeholder="請輸入圖片連結" v-model="edit.data.imageUrl">
                     </div>
                     <img class="img-fluid" :src="edit.data.imageUrl" alt="">
                   </div>
                   
                   <div class="mb-2" v-if="edit.data.imagesUrl.length > 0">
                     <div class="mb-3" v-for="(item,index) in edit.data.imagesUrl" :key="index" >
                       <div>
                         <label for="imageUrl" class="form-label">輸入圖片網址</label>
                         <input type="text" class="form-control"
                               placeholder="請輸入圖片連結" v-model="edit.data.imagesUrl[index]">
                       </div>
                       <img class="img-fluid" :src="item" alt="">
                     </div>
                    
                     <div v-if="edit.data.imagesUrl[edit.data.imagesUrl.length - 1]">
                       <button class="btn btn-outline-primary btn-sm d-block w-100" @click="edit.data.imagesUrl.push('')">
                         新增圖片
                       </button>
                     </div>
                     <div v-else>
                       <button class="btn btn-outline-danger btn-sm d-block w-100" @click="edit.data.imagesUrl.pop()">
                         刪除圖片
                       </button>
                     </div>
                   </div>
                   <div v-else>
                     <button class="btn btn-outline-primary btn-sm d-block w-100" @click="addImages">
                       新增圖片
                     </button>
                   </div>
                 </div>
                 <div class="col-sm-8">
                   <div class="mb-3">
                     <label for="title" class="form-label">標題</label>
                     <input id="title" type="text" class="form-control" placeholder="請輸入標題" v-model="edit.data.title">
                   </div>

                   <div class="row">
                     <div class="mb-3 col-md-6">
                       <label for="category" class="form-label">分類</label>
                       <input id="category" type="text" class="form-control"
                             placeholder="請輸入分類" v-model="edit.data.category">
                     </div>
                     <div class="mb-3 col-md-6">
                       <label for="price" class="form-label">單位</label>
                       <input id="unit" type="text" class="form-control" placeholder="請輸入單位" v-model="edit.data.unit">
                     </div>
                   </div>

                   <div class="row">
                     <div class="mb-3 col-md-6">
                       <label for="origin_price" class="form-label">原價</label>
                       <input id="origin_price" type="number" min="0" class="form-control" placeholder="請輸入原價" v-model.number="edit.data.origin_price">
                     </div>
                     <div class="mb-3 col-md-6">
                       <label for="price" class="form-label">售價</label>
                       <input id="price" type="number" min="0" class="form-control"
                             placeholder="請輸入售價" v-model.number="edit.data.price">
                     </div>
                   </div>
                   <hr>

                   <div class="mb-3">
                     <label for="description" class="form-label">產品描述</label>
                     <textarea id="description" type="text" class="form-control"
                               placeholder="請輸入產品描述" v-model="edit.data.description">
                     </textarea>
                   </div>
                   <div class="mb-3">
                     <label for="content" class="form-label">說明內容</label>
                     <textarea id="description" type="text" class="form-control"
                               placeholder="請輸入說明內容" v-model="edit.data.content">
                     </textarea>
                   </div>
                   <div class="mb-3">
                     <div class="form-check">
                       <input id="is_enabled" class="form-check-input" type="checkbox"
                             :true-value="1" :false-value="0" v-model="edit.data.is_enabled">
                       <label class="form-check-label" for="is_enabled">是否啟用</label>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
             <div class="modal-footer">
               <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" @click="clearForm">
                 取消
               </button>
               <button type="button" class="btn btn-primary" @click="putProduct">
                 確認
               </button>
             </div>
           </div>
         </div>
       </div>`
        
       })
       //分頁元件
       app.component('pagination',{
        props:['page'],
       methods:{
        emitPage(item){
            this.$emit('emitPage',item)
        }
       },
       template:`<nav aria-label="Page navigation example">
       <ul class="pagination">
         <li class="page-item" :class="{'disabled':page.current_page === 1}">
           <a class="page-link" href="#" aria-label="Previous" @click.prevent= "emitPage(page.current_page - 1) ">
             <span aria-hidden="true">&laquo;</span>
           </a>
         </li>
         <li class="page-item"  v-for="(item , index) in page.total_pages" :class="{'active':item === page.current_page}"><a class="page-link" href="#" @click.prevent="emitPage(page.current_page = item)">{{item}}</a></li>
         <li class="page-item" :class="{'disabled':page.current_page === page.total_pages}">
           <a class="page-link" href="#" aria-label="Next" @click.prven="emitPage(page.current_page + 1)">
             <span aria-hidden="true">&raquo;</span>
           </a>
         </li>
       </ul>
     </nav>`
     }),
         
       app.mount('#app')