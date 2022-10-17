// TODO: Crear las funciones, objetos y variables indicadas en el enunciado
"use strict";
// TODO: Variable global
var presupuesto = 0;
var gastos = [];
var idGasto = 0;
function actualizarPresupuesto(valor) {
    if(valor >= 0  && typeof valor === `number`)
    {
        presupuesto = valor;
        return valor;
    }
    else
    {
        console.log(`error, El numero es menor que 0`);
        return -1;
    }
}
function mostrarPresupuesto() {
    return (`Tu presupuesto actual es de ${presupuesto} €`);
}

//parametro rest
function CrearGasto(descripcion,valor,fecha,...etiqueta) {

    if([...etiqueta] === `undefined`)
    {
        this.etiquetas = []; 
    }
    else
    {
        this.etiquetas = [...etiqueta];
    }

    if(isNaN(Date.parse(fecha)))
    { 
        this.fecha = Date.now();
    }else
    {
        this.fecha = Date.parse(`${fecha}`); 
    }

    if(valor < 0 || typeof(valor) !== `number` )
    {
        valor = 0; 
    }
    
    
    
    //
    
    
    this.descripcion= `${descripcion}`,
    this.valor = valor,
        
    this.mostrarGasto = function()
    {
        return (`Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`);
    },

    this.mostrarGastoCompleto = function()
    {
        var textoEtiquetas = ``;
        for(let eti of this.etiquetas)
        {
            textoEtiquetas += `- ${eti}\n`;
        }
        return (`Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.\nFecha: ${new Date(this.fecha).toLocaleString()}\nEtiquetas:\n${textoEtiquetas}`);
    },

    this.actualizarFecha = function(fechaNueva )
    {
        if(!isNaN(Date.parse(fechaNueva)))
        { 
            this.fecha = Date.parse(fechaNueva);
        }
    },

    this.anyadirEtiquetas = function(...etiquetasAAnyadir)
    {
        if(etiquetasAAnyadir !== `undefined`)
        {
            for(let i= 0;i < etiquetasAAnyadir.length; i++)
            {
                if(!this.etiquetas.includes(etiquetasAAnyadir[i]))
                {
                    this.etiquetas.push(etiquetasAAnyadir[i]);
                }
            }
        } 
    },

    this.borrarEtiquetas = function(...nombre)
    {
        for(let j = 0;j < nombre.length;j++)
        {
            for(let i= 0;i < this.etiquetas.length; i++)
            {
                if(nombre[j] === this.etiquetas[i])
                {
                    this.etiquetas.splice(i,1);
                }
            }
        }
        
    },
    
    this.actualizarDescripcion  = function(descripcion)
    {
        this.descripcion = descripcion;
    },

    this.actualizarValor = function(valor)
    {
        if(valor >= 0 && typeof(valor) === `number`)
        {
            this.valor = valor;
        }
    }

    
    //this.actualizarFecha(fecha){
      //  if(typeof fecha === `string` )
    //}
}
    
    function anyadirGasto(gasto)
    {
        gasto.id =idGasto;
        idGasto++;
        gastos.push(gasto);
    }


    function borrarGasto(id)
    {

        for(let i = 0; i < gastos.length; i++)
        {
            if(gastos[i].id === id)
            {
                gastos.splice(i,1);
            }
        }
    }
    

    function listarGastos(){
        return gastos;
    }

    function calcularTotalGastos()
    {
        let suma = 0;
        for(let i = 0;i < gastos.length;i++)
        suma += gastos[i].valor;
        return suma;
    }


    function calcularBalance()
    {
        return presupuesto - calcularTotalGastos();
    }


// NO MODIFICAR A PARTIR DE AQUÍ: exportación de funciones y objetos creados para poder ejecutar los tests.
// Las funciones y objetos deben tener los nombres que se indican en el enunciado
// Si al obtener el código de una práctica se genera un conflicto, por favor incluye todo el código que aparece aquí debajo
export   {
    mostrarPresupuesto,
    actualizarPresupuesto,
    listarGastos,
    anyadirGasto,
    borrarGasto,
    calcularTotalGastos,
    calcularBalance,
    CrearGasto
}
