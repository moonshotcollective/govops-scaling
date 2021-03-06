import { BigInt } from '@graphprotocol/graph-ts';
import { NewGauge } from '../generated/ConvictionVoting/ConvictionVoting';
import { Gauge, Sender } from '../generated/schema';

export function handleGaugeCreated(event: NewGauge): void {
  let senderString = event.params.sender.toHexString();

  let sender = Sender.load(senderString);

  if (sender === null) {
    sender = new Sender(senderString);
    sender.address = event.params.sender;
    sender.createdAt = event.block.timestamp;
    sender.gaugeCount = BigInt.fromI32(1);
  } else {
    sender.gaugeCount = sender.gaugeCount.plus(BigInt.fromI32(1));
  }

  let gauge = new Gauge(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString()
  );

  // purpose.purpose = event.params.purpose;
  // purpose.sender = senderString;
  // purpose.createdAt = event.block.timestamp;
  // purpose.transactionHash = event.transaction.hash.toHex();

  // purpose.save();
  sender.save();
}
