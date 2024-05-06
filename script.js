const carCanvas = document.getElementById("carCanvas");
// canvas.height = window.innerHeight;    ..yahapar likhne se yeh ek bug dega(islye animate me likha hai)
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");    //giving the context(it is for 2d drawing)
const networkCtx = networkCanvas.getContext("2d"); 

const road = new Road(carCanvas.width/2,carCanvas.width*0.9);

const N = 1;
const cars = generateCars(N);
let bestCar = cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
}

//const car = new Car(road.getLaneCenter(1),100,30,50,"KEYS");     //creating a car

const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2,getRandomColor()),
];

animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

function animate(time){

    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }

//     car.update(road.borders,traffic);    //yaha fassa tha me

//     carCanvas.height = window.innerHeight;     //yahi position hai iski

//     carCtx.save();                 //moving road
//     carCtx.translate(0,-car.y+carCanvas.height*0.7);

//     road.draw(carCtx);
//     for(let i=0;i<traffic.length;i++){
//         traffic[i].draw(carCtx,"red");
//     }
//     car.draw(carCtx,"blue");

//     carCtx.restore();
//     requestAnimationFrame(animate);    //it will call the animate method again and again every second, and will give the illusion we want
// }

for(let i=0;i<cars.length;i++){
    cars[i].update(road.borders,traffic);
}
bestCar=cars.find(
    c=>c.y==Math.min(
        ...cars.map(c=>c.y)
    ));

carCanvas.height=window.innerHeight;
networkCanvas.height=window.innerHeight;

carCtx.save();
carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

road.draw(carCtx);
for(let i=0;i<traffic.length;i++){
    traffic[i].draw(carCtx);
}
carCtx.globalAlpha=0.2;
for(let i=0;i<cars.length;i++){
    cars[i].draw(carCtx);
}
carCtx.globalAlpha=1;
bestCar.draw(carCtx,true);

carCtx.restore();

networkCtx.lineDashOffset=-time/50;
Visualizer.drawNetwork(networkCtx,bestCar.brain);
requestAnimationFrame(animate);
}

