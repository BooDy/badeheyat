console.log('================================================');
console.log('[Lifecycles] Axiom lifecycle hooks module LOADED');
console.log('================================================');

const triggerImageGeneration = async (event: any) => {
  const { result, action, params } = event;
  const MICROSERVICE_URL = process.env.MICROSERVICE_URL || 'http://microservice:4000';

  console.log(`[Lifecycles] Starting triggerImageGeneration for action: ${action} on Axiom ID: ${result.id}`);

  // 1. BREAK THE LOOP: Check if this update was triggered by the microservice itself
  if (params?.data) {
    const updatedFields = Object.keys(params.data);
    console.log(`[Lifecycles] Axiom ${result.id} updated fields:`, updatedFields);
    
    // In Strapi 5, updates to images also touch updatedAt, publishedAt, and metadata fields
    const safeFields = [
      'imageOg', 'imageSquare', 'imageStory', 
      'updatedAt', 'publishedAt', 'locale', 
      'documentId', 'updatedBy', 'createdBy'
    ];
    const isInternalUpdate = updatedFields.every(f => safeFields.includes(f));
    const isManuallyTriggered = params.data.generationStarted === true;

    if (isInternalUpdate && !isManuallyTriggered && updatedFields.length > 0) {
      console.log(`[Lifecycles] Skipping image generation for Axiom ${result.id}: Internal update detected.`);
      return;
    }
  }

  try {
    const documentId = result.documentId;
    if (!documentId) return;

    // IMPORTANT: Fetch the data SYNC (awaited) while the transaction is still active
    const axiom = await strapi.documents('api::axiom.axiom').findOne({
      documentId,
      populate: ['category', 'rebuttalFacts'],
    });

    if (!axiom || !axiom.slug) return;

    // Prepare the payload
    const payload = {
      axiomId: axiom.documentId,
      badArgument: axiom.badArgument,
      rebuttalFacts: axiom.rebuttalFacts,
      slug: axiom.slug,
      backgroundColor: axiom.category?.backgroundColor,
      textColor: axiom.category?.textColor,
      accentColor: axiom.category?.accentColor,
      cardBackgroundColor: axiom.category?.cardBackgroundColor,
    };

    // 2. Hand off the network call to the background
    // We do NOT await this, allowing the hook to return and the DB transaction to commit.
    console.log(`[Lifecycles] Handing off to microservice in background for: ${axiom.slug}`);
    
    const callMicroservice = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000);

        const response = await fetch(`${MICROSERVICE_URL}/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[Lifecycles] Microservice error: ${response.status}`, errorText);
        } else {
          console.log(`[Lifecycles] Microservice success for: ${axiom.slug}`);
        }
      } catch (err) {
        console.error(`[Lifecycles] Background microservice call failed:`, err);
      }
    };

    callMicroservice();

  } catch (error) {
    console.error(`[Lifecycles] Failed to prepare image generation:`, error);
  }
};

export default {
  async afterCreate(event: any) {
    await triggerImageGeneration(event);
  },
  async afterUpdate(event: any) {
    await triggerImageGeneration(event);
  },
};
