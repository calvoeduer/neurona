import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IterationResult, Layer, LayerInput, Neuron, NeuronInput, Red } from "../../models";

@Component({
  selector: 'app-neurona-form',
  templateUrl: './neurona-form.component.html',
  styleUrls: ['./neurona-form.component.css']
})
export class NeuronaFormComponent implements OnInit {

  form: FormGroup
  neuronInput: NeuronInput = {
    inputs: [],
    outputs: []
  }
  layer?: Layer
  red?: Red
  layerInputs: LayerInput[] = []
  lastStep: number = 1

  // Graph options
  multi = [
    {
      "name": "ErroresIteraccion",
      "series": [
        {
          "name": "0",
          "value": 1
        },
      ]
    },
    {
      "name": "MaxError",
      "series": [
        {
          "name": "0",
          "value": 0
        },
      ]
    }
  ]

  view: [number, number] = [700, 300]

  // options
  legend: boolean = false
  showLabels: boolean = true
  animations: boolean = true
  xAxis: boolean = true
  yAxis: boolean = true
  showYAxisLabel: boolean = true
  showXAxisLabel: boolean = true
  xAxisLabel: string = 'Iteración'
  yAxisLabel: string = 'Error'
  timeline: boolean = true

  constructor(private builder: FormBuilder) {
    this.form = this.builder.group({
      inputs: [null, Validators.required],
      type: [''],
      subType: [''],
      triggerFunction: [''],
      trainingAlgorithm: [''],
      hiddenLayers: [0],
      layers: [[]],
      maxIterations: [1, [Validators.required]],
      trainingRate: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
      maxError: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
      neuronInput: [null]
    })

    this.layerInputs.push({neuronsNum: 0, triggerFunction: ''})
    this.layerInputs.push({neuronsNum: 0, triggerFunction: ''})
    this.layerInputs.push({neuronsNum: 0, triggerFunction: ''})
  }

  ngOnInit(): void {
  }

  loadUnicapa() {
    if (this.form.value.neuronInput.files[0]) {
      let fileReader = new FileReader()

      const neuronFile = this.form.value.neuronInput.files[0]
      fileReader.readAsText(neuronFile)

      fileReader.onload = e => {
        const content = fileReader.result as string

        console.log('Content neuron: ', content)

        const loadedLayer = JSON.parse(content) as Layer
        console.log(loadedLayer)

        this.layer = new Layer(loadedLayer.inputs, loadedLayer.outputs,loadedLayer.neurons[0].triggerFunction)
        for (let i = 0; i < loadedLayer.neurons.length; i++) {
          const neuronLoaded = loadedLayer.neurons[i]
          const neuron = new Neuron(neuronLoaded.inputs, neuronLoaded.triggerFunction)
          neuron.weights = neuronLoaded.weights
          neuron.sill = neuronLoaded.sill
          this.layer.neurons[i] = neuron
        }
      }
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.neuronInput.inputs = []
      this.neuronInput.outputs = []

      let inputs = this.form.value.inputs.files[0];
      let fileReader = new FileReader()

      fileReader.readAsText(inputs)

      fileReader.onload = e => {
        const content = fileReader.result as string

        let rows = content.split("\r\n")

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i].toString().split(';')

          const input = row[0].split(',').map(Number)
          const output = row[1].split(',').map(Number)

          this.neuronInput.inputs.push(input)
          this.neuronInput.outputs.push(output)
        }

        console.log(this.neuronInput)
      }
    }
  }

  initNeuron() {
    if (this.form.value.type == "Unicapa") {
      this.layer = new Layer(
        this.neuronInput.inputs[0].length,
        this.neuronInput.outputs[0].length,
        this.form.value.triggerFunction
      )

      console.log(this.layer)

      this.multi = [
        {
          "name": "ErroresIteraccion",
          "series": [
            {
              "name": "0",
              "value": 1
            },
          ]
        },
        {
          "name": "MaxError",
          "series": [
            {
              "name": "0",
              "value": +this.form.value.maxError
            },
          ]
        }
      ]
    }
  }

  initMulticapa() {
    if (this.form.value.type == "Multicapa") {
      this.red = new Red(
        this.neuronInput.inputs[0].length,
        this.neuronInput.outputs[0].length,
        this.layerInputs,
        Number(this.form.value.hiddenLayers),
      )

      console.log(this.red)
    }
  }

  saveNeuron() {
    let data = ''
    if (this.form.value.type == "Unicapa") {
      data = JSON.stringify(this.layer)
    } else {
      data = JSON.stringify(this.red)
    }

    const uri = 'data:application/json;charset=UTF-8,' + encodeURIComponent(data);
    const link = document.createElement('a')
    link.href = uri
    link.download = "neurona.json"

    link.click()
  }

  train() {
    if (this.form.value.type == "Unicapa") {
      if (this.layer != undefined) {

        const copy = this.multi;

        const sub = this.layer.onFinishIteration$.subscribe(result => {
          console.log('iterationError: ', result)

          ++this.lastStep;
          copy[0].series.push({
            name: this.lastStep.toString(),
            value: result.error
          })
          copy[1].series.push({
            name: this.lastStep.toString(),
            value: +this.form.value.maxError
          })
        })

        this.layer.fit(
          this.neuronInput.inputs,
          this.neuronInput.outputs,
          +this.form.value.maxIterations,
          +this.form.value.trainingRate,
          +this.form.value.maxError)

        this.multi = [...copy]
        sub.unsubscribe()
        console.log("series: ", this.multi[0].series)
      }
    }
  }
}
