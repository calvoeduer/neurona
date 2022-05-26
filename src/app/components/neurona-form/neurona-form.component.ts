import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Layer, LayerInput, Neuron, NeuronInput, Red} from "../../models";
import {min} from "rxjs";

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

  constructor(private builder: FormBuilder) {
    this.form = this.builder.group({
      inputs: [null, Validators.required],
      type: [''],
      subType:[''],
      triggerFunction: [''],
      trainingAlgorithm:[''],
      hiddenLayers: [0],
      layers: [[]],
      maxIterations:[1, [Validators.required]],
      trainingRate:[0, [Validators.required, Validators.min(0), Validators.max(1)]],
      maxError:[0, [Validators.required, Validators.min(0),Validators.max(1)]]
    })

    this.layerInputs.push({neuronsNum: 0, triggerFunction: ''})
    this.layerInputs.push({neuronsNum: 0, triggerFunction: ''})
    this.layerInputs.push({neuronsNum: 0, triggerFunction: ''})
  }

  ngOnInit(): void {
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
      this.layer = new Layer(this.neuronInput.inputs[0].length, this.neuronInput.outputs[0].length)

      console.log(this.layer)
    }
  }

  initMulticapa() {
    if (this.form.value.type == "Multicapa") {
      this.red = new Red(
        this.neuronInput.inputs[0].length,
        this.neuronInput.outputs[0].length,
        this.layerInputs,
        Number(this.form.value.hiddenLayers)
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

}
