export type NeuronInput = {
  inputs: number[][]
  outputs: number[][]
}

export class Neuron {
    public inputs: number = 0
    public weights: number[] = []
    public sill: number = 0

    constructor(inputs: number) {
        this.inputs = inputs

        for (let index = 0; index < inputs; index++) {
            this.weights.push((Math.random() * 2) - 1.0)
        }

        this.sill = (Math.random() * 2) - 1.0
    }

    output(inputs: number[]) {
      console.assert(inputs.length == this.inputs, "Número de entradas incorrecto.")

        let acc = 0
        for (let index = 0; index < inputs.length; index++) {
            const element = inputs[index];
            acc += element * this.weights[index]
        }

        acc -= this.sill

        return acc
    }
}

export class Layer {
  public inputs: number = 0
  public outputs: number = 0
  public neurons: Neuron[] = []

  constructor(inputs: number, outputs: number) {
    this.inputs = inputs
    this.outputs = outputs

    for (let i = 0; i < outputs; i++) {
      this.neurons.push(new Neuron(inputs))
    }
  }
}
