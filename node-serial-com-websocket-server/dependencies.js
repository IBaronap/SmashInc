import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import { Server as SocketIOServer} from 'socket.io';
import { SerialPort, ReadlineParser } from 'serialport';

export {express, SocketIOServer, cors, SerialPort, ReadlineParser, dotenv, fs};