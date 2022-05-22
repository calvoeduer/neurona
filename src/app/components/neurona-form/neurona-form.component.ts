import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Layer, Neuron, NeuronInput} from "../../models";

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

  constructor(private builder: FormBuilder) {
    this.form = this.builder.group({
      inputs: [null, Validators.required],
      type: [''],
      triggerFunction: ['']
    })
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
}