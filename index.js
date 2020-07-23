const config = require("config");
const dgram = require("dgram");
// The socket must allow addresses to be reused. Otherwise, multicast will not
// work and multiple clients will not be able to connect.
const sender = dgram.createSocket({ type: "udp4", reuseAddr: true });
const pcapp = require("pcap-parser");

const IP_ADDRESS = config.get("IP_ADDRESS");
const PORT = config.get("PORT");
const USE_MULTICAST = config.get("USE_MULTICAST") || false;
const PCAP_FILENAME = config.get("PCAP_FILENAME");
const DOES_LOOP = config.get("DOES_LOOP") || true;

sender.connect(PORT, IP_ADDRESS, () => {
  if (USE_MULTICAST) {
    sender.addMembership(IP_ADDRESS);
    sender.setMulticastInterface(IP_ADDRESS); // ?
  }

  console.log("Connected to UDP client!");
  console.log("Loading PCAP file...");

  const parser = pcapp.parse(PCAP_FILENAME);
  let all_packets = [];

  parser.on("packet", packet => {
    all_packets.push(packet);
  });

  parser.on("error", error => {
    throw ("Error parsing PCAP file: ", error);
  });

  parser.on("end", () => {
    console.log("PCAP file loaded!");

    if (all_packets.length < 1) {
      throw "No packets found!";
    }
    let loop_num = 1;
    while (true) {
      console.log("Loop iteration:", loop_num);
      let start_time_us = process.hrtime.bigint() / BigInt(1000);
      let first_packet_time_us =
        BigInt(all_packets[0].header.timestampSeconds) * BigInt(1000000) +
        BigInt(all_packets[0].header.timestampMicroseconds);
      let packet_num = 0;
      while (packet_num < all_packets.length) {
        let time_since_start_us =
          process.hrtime.bigint() / BigInt(1000) - start_time_us;
        let time_since_first_packet_us =
          BigInt(all_packets[packet_num].header.timestampSeconds) *
            BigInt(1000000) +
          BigInt(all_packets[packet_num].header.timestampMicroseconds) -
          first_packet_time_us;
        if (time_since_start_us > time_since_first_packet_us) {
          // HACKY: TODO: get data robustly
          sender.send(all_packets[packet_num].data.slice(42)); // 42 is data offset in packet
          packet_num++;
        }
      }
      if (!DOES_LOOP) {
        break;
      }
      loop_num++;
    }
    console.log("All done!");
  });
});

sender.on("error", error => {
  throw ("Error connecting to UDP client: ", error);
});
