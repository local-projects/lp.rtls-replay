# RTLS Replay
Replay recorded PCAP sessions from the [RTLS server](http://github.com/local-projects/lp.rtls-server)

## Record
To record, run the server and simultaneously capture the packets into a PCAP file (e.g. using Wireshark or `tcpdump`).
Make sure to filter so that only the appropriate packets are captured (e.g. filter by `port 8282`).

## Playback
Update the `default.json` configuration in `/config` to the appropriate values (i.e. your IP address, your PCAP file name, etc.)

Then just do `npm start`!
