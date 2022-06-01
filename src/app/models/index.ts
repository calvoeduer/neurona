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

    acc -= this.sill

    switch (this.triggerFunction) {
      case TriggerFunction.Escalon:
        acc = acc > 0 ? 1 : 0
        break
    }

    return acc
  }
}

export class Layer {
  public inputs: number = 0
  public outputs: number = 0
  public neurons: Neuron[] = []

  constructor(inputs: number, outputs: number, triggerFunction: TriggerFunction) {
    this.inputs = inputs
    this.outputs = outputs

    for (let i = 0; i < outputs; i++) {
      this.neurons.push(new Neuron(inputs, triggerFunction))
    }
  }

  eval(inputs: number[]) {
    console.assert(inputs.length == this.inputs, "Número de entradas incorrecto.")

    const result = []

    for (let i = 0; i < this.outputs; i++) {
      result.push(this.neurons[i].eval(inputs))
    }

    return result
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

