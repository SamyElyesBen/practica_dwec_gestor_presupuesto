import * as gestionpr from './gestionPresupuesto.js';
"use strict";







function mostrarDatoEnId(valor,idsento)
{
    if(idsento!==undefined){
        let s= document.getElementById(idsento);
        s.innerHTML+= '' + valor;
    }
}


let mostrarGastoWeb = function(idsento,gasto){
    let sento = document.getElementById(idsento);
    let divContenedor = document.createElement("div"); 
    divContenedor.className = "gasto"; 

    sento.append(divContenedor);

    divContenedor.innerHTML += `<div class="gasto-descripcion">${gasto.descripcion}</div>
                                <div class="gasto-fecha">${gasto.fecha}</div> 
                                <div class="gasto-valor">${gasto.valor}</div>`

    let divEtiquetas = document.createElement("div");
    divEtiquetas.className = "gasto-etiquetas";
    divContenedor.append(divEtiquetas);
    for(var et of gasto.etiquetas)
    {
        divEtiquetas.innerHTML += `<span class="gasto-etiquetas-etiqueta">${et}</span>`
    }

    let botonEditar = document.createElement("button");
    botonEditar.className = "gasto-editar";
    botonEditar.type = "button";
    botonEditar.textContent = 'Editar';

    let handlerEditar = new EditarHandle();
    handlerEditar.gasto = gasto;
    botonEditar.addEventListener('click', handlerEditar);
    divContenedor.append(botonEditar);


    let botonBorrar = document.createElement("button");
    botonBorrar.className = "gasto-borrar";
    botonBorrar.type = "button";
    botonBorrar.textContent = 'Borrar';

    let handlerBorrar = new BorrarHandle();
    handlerBorrar.gasto = gasto;
    botonBorrar.addEventListener('click', handlerBorrar);
    divContenedor.append(botonBorrar);


    let borrarEtiquetasHandler = new BorrarEtiquetasHandle();
    borrarEtiquetasHandler.gasto = gasto;
    borrarEtiquetasHandler.etiqueta = et;
    divEtiquetas.addEventListener('click', borrarEtiquetasHandler);

    let botonEditForm = document.createElement('button');
        botonEditForm.className += 'gasto-editar-formulario';
        botonEditForm.id = "gasto-editar-formulario";
        botonEditForm.textContent = 'Editar (formulario)';
        botonEditForm.type = 'button';

        let editarFormNew = new EditarHandleFormulario();
        editarFormNew.gasto = gasto;

        botonEditForm.addEventListener('click', editarFormNew);
        divContenedor.append(botonEditForm);

    return sento;
}

let mostrarGastosAgrupadosWeb = function(idsento,agrup,periodo){

    let id = document.getElementById(idsento);

    let divContenedor = document.createElement('div');
    divContenedor.className= "agrupacion";
    id.append(divContenedor);

    divContenedor.innerHTML += `<h1>Gastos agrupados por ${periodo}</h1>`;

    

    for(let propiedad of Object.keys(agrup))
    {
        let divAgrupacion = document.createElement('div');
        divContenedor.append(divAgrupacion);
        divAgrupacion.className= "agrupacion-dato";
        divAgrupacion.innerHTML += `
                <span class="agrupacion-dato-clave">${propiedad}</span>
                <span class="agrupacion-dato-valor">${propiedad.valueOf()}</span>`;
    }
    return id;
}


let repintar = function()
{
    document.getElementById('presupuesto').innerHTML = '';
    document.getElementById('gastos-totales').innerHTML = '';
    document.getElementById('balance-total').innerHTML = '';
    document.getElementById('listado-gastos-completo').innerHTML = '';

    
    mostrarDatoEnId(gestionpr.mostrarPresupuesto(),'presupuesto');
    mostrarDatoEnId(gestionpr.calcularTotalGastos(),'gastos-totales');
    mostrarDatoEnId(gestionpr.calcularBalance(),'balance-total');

        for (let k of  gestionpr.listarGastos())
        mostrarGastoWeb("listado-gastos-completo", k);

        
}



let actualizarPresupuestoWeb  = function()
{
    let result = prompt("Actualiza");
    gestionpr.actualizarPresupuesto(parseInt(result));
    repintar();
}


let nuevoGastoWeb = function()  
{
    let des = prompt("descripción");
    let valor = parseFloat(prompt("valor"));
    let fecha = prompt("fecha");
    let eti = prompt("etiquetas");

    let arr = eti.split(', ');
    
    let gasto = new gestionpr.CrearGasto(des,valor,fecha,arr);
    gestionpr.anyadirGasto(gasto);
    repintar();

}


function EditarHandle(){
    this.handleEvent = function(){
        let des = prompt("descripción");
        let valor = parseFloat(prompt("valor"));
        let fecha = prompt("fecha");
        let etiqe = prompt("etiquetas");
    

        this.gasto.actualizarDescripcion(des)
        this.gasto.actualizarFecha(fecha);
        this.gasto.actualizarValor(valor);
        let etiquetas = new Array();
            etiquetas = etiqe.split(",");
            this.gasto.etiquetas = etiquetas;
        repintar();
    }
  };

  function BorrarHandle(){
    this.handleEvent = function(){
        gestionpr.borrarGasto(this.gasto.id)
        repintar();
    }
  };


  function BorrarEtiquetasHandle(){
    this.handleEvent = function(){
        this.gasto.borrarEtiquetas(this.etiqueta);
        repintar();
    }
  };

////////////////////////////////////////////////////////   Practica de formularios   /////////////////////////////////////////////////////////////////////////////////////


function nuevoGastoWebFormulario() //PRACTICA 6 La primera parte 
{
    //Copia en enunciado, aqui se esta creadno una copia del forrmulario que esta en el html
    let plantillaFormulario = document.getElementById("formulario-template").content.cloneNode(true);
    var formulario = plantillaFormulario.querySelector("form");

    let divContrPrinc = document.getElementById("controlesprincipales");
    divContrPrinc.append(formulario);

    //Para desactivar boton, cuando se elige laopcion de formulario se tiene que desactivar los otros botones.
    let botonAnyadir = document.getElementById("anyadirgasto-formulario");
    botonAnyadir.disabled = true;

    //Boton Enviar
    let enviar = new EnviarFormularioHandle();
    formulario.addEventListener('submit', enviar);

    //Boton Cancelar
    // lasiguiente linea sale en elenunciado y basicamente te dice de localizar el boton
    let botonCancelar = formulario.querySelector("button.cancelar");
    let cancelar = new CancelarFormularioHandle();
    cancelar.botonAnyadir = botonAnyadir;
    botonCancelar.addEventListener('click', cancelar);
}

function EnviarFormularioHandle() //PRACTICA 6 La primera parte 
{
    this.handleEvent = function(event)
    {
        event.preventDefault();
        let formulario = event.currentTarget; //acceder al formulario
        /////////////////// Se cogen los valores  ////////////////////
        let desc = formulario.elements.descripcion.value;
        let val = parseFloat(formulario.elements.valor.value);
        let fec = formulario.elements.fecha.value;
        let etique = formulario.elements.etiquetas.value;       

        let gastoEnv = new gestionpr.CrearGasto(desc, val, fec, etique);
        gestionpr.anyadirGasto(gastoEnv);      

        repintar();
        document.getElementById("anyadirgasto-formulario").disabled = false;

    }    
}

function CancelarFormularioHandle() //PRACTICA 6 La primera parte 
{
    this.handleEvent = function(event)
    {
        this.botonAnyadir.disabled = false;
        document.getElementById("anyadirgasto-formulario").disabled = false;
        event.currentTarget.parentNode.remove();
        repintar();
    }
}

function EditarHandleFormulario() //PRACTICA 6 La segunda parte 
{
    this.handleEvent = function(event) 
    {
        let plantillaFormulario = document.getElementById("formulario-template").content.cloneNode(true);
        var formulario = plantillaFormulario.querySelector("form");

        let divContrPrinc = document.getElementById("controlesprincipales");
        divContrPrinc.append(formulario);

        let botonEditForm  = event.currentTarget; //acceder al formulario
        botonEditForm.after(formulario);
        botonEditForm.disabled = true;

        formulario.elements.descripcion.value = this.gasto.descripcion;
        formulario.elements.valor.value = parseFloat(this.gasto.valor);
        formulario.elements.fecha.value = new Date(this.gasto.fecha).toISOString().substring(0,10);
        formulario.elements.etiquetas.value = this.gasto.etiquetas.toString(); 

        //Boton Enviar
        let enviarFormulario = new EnviarHandle();
        enviarFormulario.gasto = this.gasto;
        formulario.addEventListener('submit', enviarFormulario);

        //Boton Cancelar
        let cancelarFormulario = new CancelarFormularioHandle();
        cancelarFormulario.botonAnyadir = botonEditForm;
        let botonCancelarFormulario = formulario.querySelector("button.cancelar");
        botonCancelarFormulario.addEventListener('click', cancelarFormulario);
    }
}function EnviarHandle() //PRACTICA La segunda parte 
{
    this.handleEvent = function(event) 
    {
        event.preventDefault();
        let formulario = event.currentTarget; //acceder al formulario
        
        let desc = formulario.elements.descripcion.value;
        this.gasto.actualizarDescripcion(desc);

        let val = parseFloat(formulario.elements.valor.value);
        this.gasto.actualizarValor(val);

        let fec = formulario.elements.fecha.value;
        this.gasto.actualizarFecha(fec);

        let etique = formulario.elements.etiquetas.value; 
        this.gasto.anyadirEtiquetas(etique);           

        repintar();
    }
}
/////////////////////////////////////////////////////// Práctica de expresiones regulares ////////////////////////////////////////////////////////

function filtrarGastosWeb()
{
    this.handleEvent = function(event) 
    {
        event.preventDefault();

        let form = event.currentTarget;

        let desc = form.elements['formulario-filtrado-descripcion'].value;
        let minimo = parseFloat(form.elements['formulario-filtrado-valor-minimo'].value);
        let maximo = parseFloat(form.elements['formulario-filtrado-valor-maximo'].value);
        let desde = form.elements['formulario-filtrado-fecha-desde'].value;
        let hasta = form.elements['formulario-filtrado-fecha-hasta'].value;
        let etiq = form.elements['formulario-filtrado-etiquetas-tiene'].value;


        let a;

        if(etiq.length > 0){
            a = gestionpr.transformarListadoEtiquetas(etiq);
        }
        
        let obj = {
            descripcionContiene : desc,
            fechaHasta : hasta,
            fechaDesde : desde,
            valorMaximo : maximo,
            valorMinimo : minimo,
            etiquetasTiene : a
        }


        document.getElementById("listado-gastos-completo").innerHTML="";
        
        
        let gFiltrado = gestionpr.filtrarGastos(obj);

        gFiltrado.forEach(g => {
            mostrarGastoWeb('listado-gastos-completo',g);
        });
        
    }
}





  let s = document.getElementById('actualizarpresupuesto')

  s.onclick = actualizarPresupuestoWeb;
  
  let e = document.getElementById('anyadirgasto');
  
  e.onclick = nuevoGastoWeb;


  let anyadirgastoForm = document.getElementById("anyadirgasto-formulario");
  anyadirgastoForm.addEventListener('click', nuevoGastoWebFormulario);

let filtrarLosGastos = new filtrarGastosWeb();
 document.getElementById("formulario-filtrado").addEventListener("submit", filtrarLosGastos);


export   {
    mostrarDatoEnId,
    mostrarGastoWeb,
    mostrarGastosAgrupadosWeb,
    repintar,
    actualizarPresupuestoWeb,
    nuevoGastoWeb,
    nuevoGastoWebFormulario
}