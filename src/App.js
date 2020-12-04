import React, { Component} from 'react';
import logo from './logo.svg'
import './App.css';
//import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {Modal,ModalBody,ModalFooter,ModalHeader} from 'reactstrap';
import Moment from 'moment';

//constante deonde almacena mi url de conexion
const url = "https://localhost:44377/api/Recibo/";

class App extends Component {

      state = {
              data:[],
              modalInsertar:false,
              modalEliminar:false,
              form:{  
                  iD_Proveedor:'',   
                  proveedor_Nombre:'',
                  monto:'',
                  fecha:'',
                  comentarios:'',
                  tipoModal: ''       
              }
            }
     
    peticionGet=()=>{
      axios.get(url).then(response=>{        
        this.setState({data: response.data}); //mostrar los datos de mi state
      }).catch(error=>{
        console.log(error);      
      });
    } 
  
    peticionPost=async()=>{          
      await axios.post(url,this.state.form).then(response=>{
           this.modalInsertar();
           this.peticionGet();
       }).catch(error=>{
         console.log(error.message);
       })
     }   

    perticionPut=()=>{
       axios.put(url+this.state.form.iD_Proveedor, this.state.form).then(response=>{
         this.modalInsertar();
         this.peticionGet();
       })
    }
peticionDelete=()=>{
  axios.delete(url+this.state.form.iD_Proveedor).then(response=>{
    this.setState({modalEliminar: false});
    this.peticionGet();
  })
}
    //al momento de precionar el boton se ejecuta para abrir el modal que cambia el estado de verdadero a falso 
    modalInsertar=()=>{
      this.setState({modalInsertar: !this.state.modalInsertar});
    }
    //en este metodod obtengo los datos de el proveedor
    seleccionarProveedor= async(proveedor)=>{
      await this.setState({
          tipoModal: 'actualizar',
          form:{
                  iD_Proveedor:proveedor.iD_Proveedor,
                  proveedor_Nombre:proveedor.proveedor_Nombre,
                  monto:proveedor.monto,
                  fecha:proveedor.fecha,
                  comentarios:proveedor.comentarios
               }
         })
    }
    //me cambia el valor de mi state(estado)
    handleChange=async e=> {
       e.persist();
       await this.setState({
          form:{
                 ...this.state.form,  //esta linea hereda todos los atrributos que exsistan en el form y no se borren al momento que el usuario escriba 
                 [e.target.name]: e.target.value
              }
        });
     //   console.log(this.state.form);// comprobamos que se este capturando
    }

    componentDidMount(){   
      this.peticionGet();
    }
    
  render() {
                const form = this.state.form;//obtener el valor del estado
                console.log(form);
              return (
                <div className="App">   
                <nav className="navbar navbar-dark bg-dark">
                    <img src={logo} className="App-logo" alt="logo"/>
                </nav>   
                <br/> 
                <button className="btn btn-success" onClick={()=>{this.setState({form: null,tipoModal: 'insertar'});this.modalInsertar()}}>Agregar Proveedor</button>
                  <br/><br/>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Proveedor</th>
                          <th>Monto</th>
                          <th>Fecha</th>
                          <th>Comentarios</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.data.map(proveedor=>{
                          return(
                            <tr>
                              <td key={proveedor.iD_Proveedor}>{proveedor.iD_Proveedor}</td>
                              <td>{proveedor.proveedor_Nombre}</td>
                              <td>{proveedor.monto}</td>
                              <td>{Moment(proveedor.fecha).format('MM-DD-YYYY')}</td>
                              <td>{proveedor.comentarios}</td>
                              <td>
                        <button className="btn btn-primary" onClick={()=>{this.seleccionarProveedor(proveedor); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>                            
                                  {"  "}
                                <button className="btn btn-danger" onClick={()=>{this.seleccionarProveedor(proveedor); this.setState({modalEliminar:true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>

                      <Modal isOpen={this.state.modalInsertar}>
                          <ModalHeader style={{display: 'block'}}>
                            <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
                          </ModalHeader>
                          <ModalBody>
                              <div className="form-group">
                                <label htmlFor='proveedor_Nombre'>Proveedor</label>
                                  <br/>
                                <input type="text" className="form-control" name="proveedor_Nombre" id="proveedor_Nombre" onChange={this.handleChange} value={form?this.state.form.proveedor_Nombre:''}/>
                                  <br/>
                                  <label htmlFor='monto'>Momto</label>
                                  <br/>
                                <input type="text" className="form-control" name="monto" id="monto" onChange={this.handleChange} value={form?this.state.form.monto:''}/>
                                  <br/> 
                                  <label htmlFor='fecha'>Fecha</label>
                                  <br/>
                                <input type="date" className="form-control" name="fecha" id="fecha" onChange={this.handleChange}  value={form?this.state.form.fecha:''}/>
                                  <br/> 
                                  <label htmlFor='comentarios'>Comentarios</label>
                                  <br/>
                                <textarea type="maxlength" className="form-control" name="comentarios" id="comentarios" onChange={this.handleChange} value={form?this.state.form.comentarios:''}/>
                                  <br/> 
                              </div>
                          </ModalBody>
                          <ModalFooter>{
                                          this.state.tipoModal==='insertar'?
                                          <button className="btn btn-success" onClick={()=>this.peticionPost()}>
                                            Insertar
                                          </button>:<button className="btn btn-success" onClick={()=>this.perticionPut()}>
                                            Actualizar
                                          </button>
                                        }                              
                                    <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
                          </ModalFooter>
                      </Modal>
                      <Modal isOpen={this.state.modalEliminar}>
                        <ModalBody>
                          Estás Seguro de Elminar el Proveedor?{form && form.proveedor_Nombre}
                        </ModalBody>
                        <ModalFooter>
                          <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
                          <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
                        </ModalFooter>
                      </Modal>
                    </table>      
                </div>
              );
            }
      }
        
export default App;
