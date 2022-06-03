import { EventEmitter } from "@angular/core";

export type NeuronInput = {
  inputs: number[][]
  outputs: number[][]
}

export type LayerInput = {
  neuronsNum?: number
  triggerFunction?: string
}

enum TriggerFunction {
  Escalon = 'Escalon',
  Lineal = 'Lineal'
}

export type IterationResult = {
  step: number
  error: number
}

export class Neuron {
  public inputs: number = 0
  public weights: number[] = []
  public sill: number = 0
  public triggerFunction: TriggerFunction


  constructor(inputs: number, triggerFunction: TriggerFunction) {
    this.inputs = inputs
    this.triggerFunction = triggerFunction

    for (let index = 0; index < inputs; index++) {
      this.weights.push((Math.random() * 2) - 1.0)
    }

    this.sill = (Math.random() * 2) - 1.0
  }

  eval(inputs: number[]) {
    console.assert(inputs.length == this.inputs, "Número de entradas incorrecto.")

    let acc = 0
    for (let index = 0; index < inputs.length; index++) {
      const element = inputs[index];
      acc += element * this.weights[index]
    }

    acc += this.sill

    switch (this.triggerFunction) {
      case TriggerFunction.Escalon:
        acc = acc > 0 ? 1 : 0
        break
    }

    return acc
  }

  updateWeights(linealError: number, inputs: number[], trainingRate: number) {
    console.assert(inputs.length == this.inputs, "Número de entradas incorrecto.")

    console.log('Old weights: ', this.weights)

    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i] += linealError * inputs[i] * trainingRate;
    }

    console.log('New weights: ', this.weights)

    this.sill += trainingRate * linealError
  }
}

export class Layer {
  public inputs: number = 0
  public outputs: number = 0
  public neurons: Neuron[] = []

  public onFinishIteration$: EventEmitter<IterationResult>

  constructor(inputs: number, outputs: number, triggerFunction: TriggerFunction) {
    this.inputs = inputs
    this.outputs = outputs

    for (let i = 0; i < outputs; i++) {
      this.neurons.push(new Neuron(inputs, triggerFunction))
    }

    this.onFinishIteration$ = new EventEmitter<IterationResult>()
  }

  init() {
    this.onFinishIteration$ = new EventEmitter<IterationResult>()
  }

  eval(inputs: number[]) {
    console.assert(inputs.length == this.inputs, "Número de entradas incorrecto.")

    const result = []

    for (let i = 0; i < this.outputs; i++) {
      result.push(this.neurons[i].eval(inputs))
    }

    return result
  }

  fit(inputs: number[][], outputs: number[][], maxSteps: number, trainingRate: number, errorTolerance: number) {
    const iterationErrors = []

    for (let i = 0; i < maxSteps; i++) {

      let evalOutput: number[] = []
      let patternErrors: number[] = []

      for (let j = 0; j < inputs.length; j++) {
        evalOutput = this.eval(inputs[j])
        const output = outputs[j]

        console.log("Output: ", evalOutput, " Real output: ", output)

        const errors = output.map((value, index) => evalOutput[index] - value)

        console.log('Lineal error: ', errors)

        let patternError = 0;
        for (let k = 0; k < errors.length; k++) {
          patternError += Math.abs(errors[k]) / this.outputs
        }
        console.log("Pattern error: ", patternError)
        patternErrors.push(patternError)

        this.updateWeights(errors, inputs[j], trainingRate)
      }

      const iterationError = patternErrors.reduce((prev, acc) => acc + prev) / patternErrors.length
      patternErrors = []
      iterationErrors.push(iterationError)

      this.onFinishIteration$.emit({
        step: i,
        error: iterationError
      })

      if (iterationError <= errorTolerance) {
        break
      }
    }
  }

  updateWeights(linealErrors: number[], inputs: number[], trainingRate: number) {
    for (let i = 0; i < linealErrors.length; i++) {
      this.neurons[i].updateWeights(linealErrors[i], inputs, trainingRate)
    }
  }
}

export class Red {
  public inputs: number = 0
  public outputs: number = 0
  public layers: Layer[] = []

  constructor(inputs: number, outputs: number, layers: LayerInput[], maxLayers: number) {
    this.inputs = +inputs
    this.outputs = +outputs

    for (let i = 0; i < maxLayers; i++) {
      this.layers.push(new Layer(
        i == 0 ? +this.inputs : +(layers[i - 1].neuronsNum || 0),
        +(layers[i].neuronsNum || 0),
        TriggerFunction.Escalon)
      )
    }
  }

  eval(inputs: number[]) {
    console.assert(inputs.length == this.inputs, "Número de entradas incorrecto.")

    let result = inputs
    for (const layer of this.layers) {
      result = layer.eval(result)
    }

    return result
  }
}

