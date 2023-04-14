#include <pitches.h> //For sounds

//Pins
int XPin = A0;
int BTNPin = 2;
int BuzzPin = 4;

//Joystick
int XPosition = 0;
int PreviousXPosition = XPosition;
int mapXValue;

int threshold = 1;

//Button
bool BTNState = false;
bool PreviousBTNState = false;

//Setup & Loop
void setup() {
  pinMode(BTNPin, INPUT);
  pinMode(XPin, INPUT);
  pinMode(BuzzPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  if (Serial.available() > 0) {
    receivingData();
  } else {
    sendingData();
  }
  delay(10);
}

//Send Data
void sendingData() {

  XPosition = analogRead(XPin);
  BTNState = digitalRead(BTNPin);

  //X joystick
  if (XPosition < 500) {
    mapXValue = 0;
    sendSerialMessage('J', 'X', mapXValue);
    delay(100);
  }
  else if (XPosition >= 500 && XPosition <= 520) {
    mapXValue = 1;
    sendSerialMessage('J', 'X', mapXValue);
    delay(100);
  }
  else if (XPosition > 520) {
    mapXValue = 2;
    sendSerialMessage('J', 'X', mapXValue);
    delay(100);
  } 
  
  //BTN
  if (BTNState && !PreviousBTNState) {  //Pressed!
    sendSerialMessage('B', 'A', BTNState);
    delay(50);
    PreviousBTNState = true;
  } else if (!BTNState && PreviousBTNState) {  //Released!
    PreviousBTNState = false;
  }

  delay(100);
}

void receivingData() {

  char inByte = Serial.read();

  switch (inByte) {
    case 'A': //Continue
      tone(BuzzPin, NOTE_C4, 50);
      delay(60);
      tone(BuzzPin, NOTE_G4, 50);
      delay(60);
      noTone(BuzzPin); 
      delay(500); 
    break;

    case 'G': //Start game
      tone(BuzzPin,660,100);
      delay(150);
      tone(BuzzPin,660,100);
      delay(300);
      tone(BuzzPin,660,100);
      delay(300);
      tone(BuzzPin,510,100);
      delay(100);
      tone(BuzzPin,660,100);
      delay(300);
      tone(BuzzPin,770,100);
      delay(550);
      tone(BuzzPin,380,100);
      delay(575);
    break;

    case 'J': //Jump sound
      tone(BuzzPin, NOTE_E5, 100);
      delay(200);
      tone(BuzzPin, NOTE_E6, 100);
      delay(200);
      noTone(BuzzPin);
      delay(2000);
    break;

    case 'W'://Walk sound
      tone(BuzzPin, NOTE_C4, 40);
      delay(15); 
      noTone(BuzzPin); 
      delay(15); 
      tone(BuzzPin, NOTE_A3, 40);
      delay(75); 
      noTone(BuzzPin); 
      delay(15); 
    break;

    case 'O': //Game over
      int notaGame[] = { NOTE_E4, NOTE_E4, NOTE_E4, NOTE_C4, NOTE_E4, NOTE_G4, NOTE_G3, NOTE_C4 };
      int duracionGame[] = { 100, 100, 200, 200, 200, 200, 400, 800 };
            
      for (int i = 0; i < 8; i++) { // Reproduce cada nota en la secuencia
          tone(BuzzPin, notaGame[i], duracionGame[i]);
          delay(duracionGame[i] * 1.2); // Ajusta el tiempo de espera
        }
        noTone(BuzzPin);
        delay(500);
    break;
  }
  Serial.flush();
}

void sendSerialMessage(char keyA, char keyB, int Value) {
  Serial.print(keyA);
  Serial.print(' ');
  Serial.print(keyB);
  Serial.print(' ');
  Serial.print(Value);
  Serial.print(' ');
  Serial.println();
}