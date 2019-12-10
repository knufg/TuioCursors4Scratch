# TuioCursors4ScratchExtension

This is a scratch extension for TUIO, which was developed only for the use of multiple TuioCursors 
on multi-touch tables or in spaces equiped with a laser tracking system using the TUIO protocoll.
The extension is based on the Scratch4TUIO extension <http://caesarion.github.io/scratch4tuio>.

The following information ist taken from Scratch4TUIO:
TuioCursors4Scratch also uses an OSC-Dispatcher program that relays the incoming TUIO
messages, which are sent via the UDP protocol, to Scratch4TUIO via _Socket.io_.
You can download the JAR here:
<https://github.com/caesarion/scratch4tuio-server/releases/download/v1.0.1/scratch4tuio-dispatcher.jar>

Start the OSC-Dispatcher from console via

```bash
java -jar OSC-Dispatcher.jar -p 3333
```

The `-p` option denotes the port on which the TUIO-Server runs, `3333` is the
standard port for TUIO. The OSC-Dispatcher and Scratch4TUIO use port
`5000`.

Now you still need a TUIO-Server, e.g. a provider of TUIO-data. You can use one
of the listed TUIO-Server below. For the start I recommend to use the
TUIO-Simulator: <http://sourceforge.net/projects/reactivision/files/TUIO%201.0/TUIO-Clients%201.4/TUIO_Simulator-1.4.zip/download?use_mirror=heanet&download=>

For more information about the TUIO protocol see <http://www.tuio.org/>

Some projects using TUIO and TUIO-Server: <http://www.reactable.com>, <https://code.google.com/p/tuiokinect/>, <http://www.tuio.org/?software>, <http://www.reactivision.com>
