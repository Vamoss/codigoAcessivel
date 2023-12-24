var bpm = 80;//batidas por minuto
var volume = -10;//intensidade do som
var portamento = 0.05;//deslize vocal
var melodia = ["G3", ["D3", "F3", "A3", "G3"], "B2", "E3", "C3", ["A2", "G2"], "D3", "F2"];
var oscilador = "amtriangle";//experimente square, sine, triangle ou sawtooth
var ataque = 0.05;//tempo que a nota leva para começar
var decaimento = 0.5;//tempo que a nota leva para diminuir
var sustentacao = 1;//tempo que a nota se mantém
var liberacao = 5;//tempo que a nota leva para desaparecer
var duracao = 0.5;//duração da nota em segundos
var qtdNotas = 4;//quantidade de notas por intervalo
var sintentizador = new Tone.Synth({
volume,
portamento,
oscillator: {
type: oscilador
},
envelope: {
attack: ataque,
decay: decaimento,
sustain: sustentacao,
release: liberacao
}
}).toDestination();
Tone.Transport.bpm.value = bpm;
Tone.Transport.start();
Tone.Transport.loop = true;
Tone.Transport.loopStart = 0;
Tone.Transport.loopEnd = '2:0:0';
sequencia = new Tone.Sequence(function(tempo, nota) {
sintentizador.triggerAttackRelease(nota, duracao, Tone.now());
}, melodia, qtdNotas+'n');
sequencia.start();