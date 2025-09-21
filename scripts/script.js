/*********************************************************************************
 * 
 * Ce fichier contient toutes les fonctions nécessaires au fonctionnement du jeu. 
 * 
 *********************************************************************************/

/**
 * Affiche le résultat (score) dans la zone prévue à cet effet
 * @param {number} score - Le score actuel
 * @param {number} nombreQuestions - Le nombre total de questions
 */
function afficherResultat(score, nombreQuestions) {
    let zonePourScore = document.querySelector(".zoneScore span");
    zonePourScore.innerText = `${score}/${nombreQuestions}`;
}

/**
 * Affiche la proposition (mot ou phrase) à taper
 * @param {string} motsAfficher - Le mot ou la phrase à afficher
 */
function afficherProposition(motsAfficher) {
    let zoneProposition = document.querySelector(".zoneProposition");
    zoneProposition.innerText = motsAfficher;
}

/**
 * Met à jour le score en comparant la saisie avec la proposition
 * @param {string} motsAfficher - Le mot ou la phrase à taper
 * @param {string} motsEcritParUtilisateur - La saisie de l'utilisateur
 * @param {number} score - Le score actuel
 * @returns {number} Le nouveau score
 */
function miseAjourScore(motsAfficher, motsEcritParUtilisateur, score) {
    if (motsAfficher === motsEcritParUtilisateur) {
        score++;
    }
    return score;
}

/**
 * Construit et affiche l'email de partage du score
 * @param {string} nom - Le nom du joueur
 * @param {string} email - L'email de la personne avec qui partager le score
 * @param {string} score - Le score à partager
 */
function afficherEmail(nom, email, score) {
    let mailto = `mailto:${email}?subject=Partage du score Azertype&body=Salut, je suis ${nom} et je viens de réaliser le score ${score} sur le site d'Azertype !`;
    location.href = mailto;
}

/**
 * Valide le nom saisi (doit avoir au moins 2 caractères)
 * @param {string} nom - Le nom à valider
 * @throws {Error} Si le nom est trop court
 */
function validerNom(nom) {
    if (nom.length < 2) {
        throw new Error(`Le nom '${nom}' est trop court`);
    }
}

/**
 * Valide l'email saisi avec une expression régulière
 * @param {string} email - L'email à valider
 * @throws {Error} Si l'email n'est pas valide
 */
function validerEmail(email) {
    let regexEmail = new RegExp("^[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.-]+\\.[a-zA-Z0-9_.-]{2,10}$");
    if (regexEmail.test(email) === false) {
        throw new Error(`L'email '${email}' n'est pas valide`);
    }
}

/**
 * Affiche un message d'erreur dans la popup
 * @param {string} messageErreur - Le message d'erreur à afficher
 */
function afficherMessageErreur(messageErreur) {
    let baliseSpan = document.getElementById("ErreurMessage");
    if (!baliseSpan) {
        baliseSpan = document.createElement("span");
        baliseSpan.id = "ErreurMessage";
        let baliseParentDeSpan = document.querySelector(".popup");
        baliseParentDeSpan.appendChild(baliseSpan);
    }
    baliseSpan.innerText = messageErreur;
}

/**
 * Gère la soumission du formulaire de partage
 * @param {string} scoreEmail - Le score à partager
 */
function gererFormulaire(scoreEmail) {
    try {
        let baliseNom = document.getElementById("nom");
        validerNom(baliseNom.value);

        let baliseEmail = document.getElementById("email");
        validerEmail(baliseEmail.value);

        afficherEmail(baliseNom.value, baliseEmail.value, scoreEmail);
        afficherMessageErreur("");
        cacherPopup(); // Fermer la popup après envoi réussi
    } catch (error) {
        afficherMessageErreur(error.message);
    }
}

/**
 * Fonction principale qui lance le jeu
 */
function lancerJeu() {
    // Initialise les écouteurs d'événements pour la popup
    initAddEventListenerPopup();

    let score = 0;
    let listeProposition = listeMots; // Utilise les mots par défaut
    let btnValiderMot = document.getElementById("btnValiderMot");
    let inputEcriture = document.getElementById("inputEcriture");
    let i = 0; // Index de la proposition actuelle

    // Affiche la première proposition
    afficherProposition(listeProposition[i]);

    // Écouteur pour le bouton de validation
    btnValiderMot.addEventListener("click", () => {
        score = miseAjourScore(listeProposition[i], inputEcriture.value, score);
        i++;
        afficherResultat(score, i);
        
        if (listeProposition[i] === undefined) {
            // Fin du jeu
            afficherProposition("Le jeu est fini");
            inputEcriture.value = '';
            btnValiderMot.disabled = true;
        } else {
            // Proposition suivante
            afficherProposition(listeProposition[i]);
            inputEcriture.value = '';
        }
    });

    // Écouteurs pour les boutons radio (changement entre mots et phrases)
    let btnRadio = document.querySelectorAll("input[name='optionSource']");
    for (let j = 0; j < btnRadio.length; j++) {
        btnRadio[j].addEventListener("change", (event) => {
            if (event.target.value === "1") {
                listeProposition = listeMots;
            } else {
                listeProposition = listePhrases;
            }

            // Réinitialiser l'index et le score quand on change de mode
            i = 0;
            score = 0;
            afficherResultat(score, i);
            btnValiderMot.disabled = false;

            if (i >= listeProposition.length) {
                afficherProposition("Le jeu est fini");
            } else {
                afficherProposition(listeProposition[i]);
            }
        });
    }

    // Écouteur pour la soumission du formulaire de partage
    let form = document.querySelector("form");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        let scoreEmail = `${score}/${i}`;
        gererFormulaire(scoreEmail);
    });

    // Affiche le score initial
    afficherResultat(score, i);
}