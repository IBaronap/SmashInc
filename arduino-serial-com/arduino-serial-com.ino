//Pins
int XPin = A0;
int BTNPin = 2;
int BuzzPin = 4;

//Joystick
int XPosition = 0;
int PreviousXPosition = XPosition;

int threshold = 5;

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
  BTNState = digitalRead(BTN);

  //X joystick
  if (XPosition > PreviousXPosition + threshold || XPosition < PreviousXPosition - threshold) {
    sendSerialMessage('J', 'X', XPosition);
    PreviousXPosition = XPosition;
  }
  
  //BTN
  if (BTNState && !PreviousBTNState) {  //Pressed!
    sendSerialMessage('J', 'B', BTNState);
    delay(50);
    PreviousBTNState = true;
  } else if (!BTNState && PreviousBTNState) {  //Released!
    sendSerialMessage('J', 'B', BTNState);
    PreviousState = false;
  }

  delay(100);
}

void receivingData() {

  char inByte = Serial.read();

  switch (inByte) {
    case 'START':
      break;
    case 'GAME':
      break;
    case 'UP':
      break;
    case 'LEFT':
      break;
    case 'RIGHT':
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