const Ziggy = {"url":"http:\/\/localhost","port":null,"defaults":{},"routes":{"home":{"uri":"\/","methods":["GET","HEAD"]},"dashboard":{"uri":"dashboard","methods":["GET","HEAD"]},"profile.edit":{"uri":"profile","methods":["GET","HEAD"]},"profile.update":{"uri":"profile","methods":["PATCH"]},"profile.destroy":{"uri":"profile","methods":["DELETE"]},"farmer.login":{"uri":"farmer\/login","methods":["GET","HEAD"]},"farmer.register":{"uri":"farmer\/register","methods":["GET","HEAD"]},"farmer.logout":{"uri":"farmer\/logout","methods":["POST"]},"farmer.dashboard":{"uri":"farmer\/dashboard","methods":["GET","HEAD"]},"farmer.profile.edit":{"uri":"farmer\/profile","methods":["GET","HEAD"]},"farmer.profile.update":{"uri":"farmer\/profile","methods":["PATCH"]},"farmer.profile.destroy":{"uri":"farmer\/profile","methods":["DELETE"]},"farmer.farm-profile.edit":{"uri":"farmer\/farm-profile","methods":["GET","HEAD"]},"farmer.farm-profile.store":{"uri":"farmer\/farm-profile","methods":["POST"]},"farmer.farm-profile.update":{"uri":"farmer\/farm-profile\/{farmProfile}","methods":["PUT"],"parameters":["farmProfile"],"bindings":{"farmProfile":"id"}},"farmer.products.index":{"uri":"farmer\/products","methods":["GET","HEAD"]},"farmer.products.show":{"uri":"farmer\/products\/{product}","methods":["GET","HEAD"],"parameters":["product"],"bindings":{"product":"id"}},"farmer.cart.index":{"uri":"farmer\/cart","methods":["GET","HEAD"]},"farmer.cart.add":{"uri":"farmer\/cart\/add\/{product}","methods":["POST"],"parameters":["product"],"bindings":{"product":"id"}},"farmer.cart.update":{"uri":"farmer\/cart\/{cartItem}","methods":["PATCH"],"parameters":["cartItem"],"bindings":{"cartItem":"id"}},"farmer.cart.remove":{"uri":"farmer\/cart\/{cartItem}","methods":["DELETE"],"parameters":["cartItem"],"bindings":{"cartItem":"id"}},"farmer.checkout":{"uri":"farmer\/checkout","methods":["GET","HEAD"]},"farmer.orders.store":{"uri":"farmer\/orders","methods":["POST"]},"farmer.orders.index":{"uri":"farmer\/orders","methods":["GET","HEAD"]},"farmer.orders.show":{"uri":"farmer\/orders\/{order}","methods":["GET","HEAD"],"parameters":["order"],"bindings":{"order":"id"}},"farmer.orders.reorder":{"uri":"farmer\/orders\/{order}\/reorder","methods":["POST"],"parameters":["order"],"bindings":{"order":"id"}},"farmer.crops.index":{"uri":"farmer\/crops","methods":["GET","HEAD"]},"farmer.crops.create":{"uri":"farmer\/crops\/create","methods":["GET","HEAD"]},"farmer.crops.store":{"uri":"farmer\/crops","methods":["POST"]},"farmer.crops.show":{"uri":"farmer\/crops\/{crop}","methods":["GET","HEAD"],"parameters":["crop"],"bindings":{"crop":"id"}},"farmer.crops.edit":{"uri":"farmer\/crops\/{crop}\/edit","methods":["GET","HEAD"],"parameters":["crop"],"bindings":{"crop":"id"}},"farmer.crops.update":{"uri":"farmer\/crops\/{crop}","methods":["PATCH"],"parameters":["crop"],"bindings":{"crop":"id"}},"farmer.crops.destroy":{"uri":"farmer\/crops\/{crop}","methods":["DELETE"],"parameters":["crop"],"bindings":{"crop":"id"}},"farmer.crops.mark-as-sold":{"uri":"farmer\/crops\/{crop}\/mark-as-sold","methods":["PATCH"],"parameters":["crop"],"bindings":{"crop":"id"}},"register":{"uri":"register","methods":["GET","HEAD"]},"login":{"uri":"login","methods":["GET","HEAD"]},"password.request":{"uri":"forgot-password","methods":["GET","HEAD"]},"password.email":{"uri":"forgot-password","methods":["POST"]},"password.reset":{"uri":"reset-password\/{token}","methods":["GET","HEAD"],"parameters":["token"]},"password.store":{"uri":"reset-password","methods":["POST"]},"verification.notice":{"uri":"verify-email","methods":["GET","HEAD"]},"verification.verify":{"uri":"verify-email\/{id}\/{hash}","methods":["GET","HEAD"],"parameters":["id","hash"]},"verification.send":{"uri":"email\/verification-notification","methods":["POST"]},"password.confirm":{"uri":"confirm-password","methods":["GET","HEAD"]},"logout":{"uri":"logout","methods":["POST"]},"storage.local":{"uri":"storage\/{path}","methods":["GET","HEAD"],"wheres":{"path":".*"},"parameters":["path"]}}};
if (typeof window !== 'undefined' && typeof window.Ziggy !== 'undefined') {
  Object.assign(Ziggy.routes, window.Ziggy.routes);
}
export { Ziggy };
