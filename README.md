# RTLS Replay
Replay recorded PCAP sessions from the [RTLS server](http://github.com/local-projects/lp.rtls-server)

## Record
To record, run the server and simultaneously capture the packets into a PCAP file (e.g. using Wireshark or `tcpdump`).
Make sure to filter so that only the appropriate packets are captured (e.g. filter by `ip.addr == 169.254.193.203 && udp.port == 8282` on Wireshark, where `169.254.193.203` is whatever address you are sending packets to).

## Playback
Update the `default.json` configuration in `/config` to the appropriate values.

This utility supports two modes of operation: UDP Unicast and UDP Multicast. Set the configuration file appropriately according to the mode-specific instructions below:

**Unicast**: A one-to-one sender-client UDP relationship. Your configuration will look similar to this. The address and port are the unicast address and port.

```json
{
  "IP_ADDRESS": "127.0.0.1",
  "PORT": 8282,
  "USE_MULTICAST": false,
  "PCAP_FILENAME": "session.pcap",
  "DOES_LOOP": true
}
```

**Multicast**: A one-to-many sender-client UDP relationship. Your configuration will look similar to this. The address and port are the multicast address and port.

```json
{
  "IP_ADDRESS": "234.5.6.7",
  "PORT": 8282,
  "USE_MULTICAST": true,
  "PCAP_FILENAME": "session.pcap",
  "DOES_LOOP": true
}
```

After your configuration files are set, then run the following commands in a terminal or command prompt:

```bash
npm install
npm start
```
