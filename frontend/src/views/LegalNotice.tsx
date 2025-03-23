const LegalNotice = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Mentions Légales</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">1. Éditeur du site</h2>
        <p className="mb-4">
          Le site CESIZen est édité dans le cadre d'un projet étudiant de CESI École d'Ingénieurs.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">2. Hébergement</h2>
        <p className="mb-4">
          [À compléter avec les informations de votre hébergeur]
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">3. Protection des données personnelles</h2>
        <p className="mb-4">
          Conformément à la loi Informatique et Libertés du 6 janvier 1978 modifiée, vous disposez d'un droit d'accès, 
          de rectification et de suppression des données vous concernant. Pour exercer ce droit, vous pouvez nous contacter 
          via votre espace utilisateur ou par email.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">4. Cookies</h2>
        <p className="mb-4">
          Ce site utilise des cookies nécessaires à son bon fonctionnement. En continuant votre navigation, 
          vous acceptez l'utilisation de ces cookies pour améliorer votre expérience utilisateur et assurer 
          certaines fonctionnalités.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">5. Propriété intellectuelle</h2>
        <p className="mb-4">
          L'ensemble du contenu de ce site (textes, images, vidéos) est protégé par le droit d'auteur. 
          Toute reproduction ou représentation totale ou partielle de ce site est interdite sans autorisation.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">6. Contact</h2>
        <p>
          Pour toute question concernant ces mentions légales, vous pouvez nous contacter via le formulaire 
          de contact disponible sur le site.
        </p>
      </section>
    </div>
  );
};

export default LegalNotice;