import { ponder } from "@/generated";

ponder.on("Orb:Load", async ({ event, context }) => {
    const { params, transaction } = event;

    const { Orb } = context.entities;

    // TODO: Create or update the Orb entity with the params.
  
    const id = event.params.$id.toString();
  
    Orb.upsert({
      id,
      create: {
        id,
      },
      update: {
        id,
      },
    })
})

ponder.on("Orb:Fork", async ({ event, context }) => {
    const { params, transaction } = event;

    const { Orb } = context.entities;

    // TODO: Append the newly created Orb id to the array of forked ids to the OG Orb.
})

ponder.on("Orb:Forfeit", async ({ event, context }) => {
    const { params, transaction } = event;

    const { Orb } = context.entities;

    // TODO: Update the vault and price of the Orb.
})

ponder.on("Orb:TransferSingle", async ({ event, context }) => {
  const { params, transaction } = event;
    // TODO: Update the balance of the sender and receiver.

  const { Orb } = context.entities;
})

ponder.on("Orb:TransferBatch", async ({ event, context }) => {
    // TODO: Update the balance of the sender and receiver.
})