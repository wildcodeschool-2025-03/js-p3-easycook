import bcrypt from "bcryptjs";
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import memberRepository from "./memberRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all items
    const members = await memberRepository.readAll();

    // Respond with the items in JSON format
    res.json(members);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const membersId = Number(req.params.id);
    const member = await memberRepository.read(membersId);

    if (member == null) {
      res.sendStatus(404);
    } else {
      res.json(member);
    }
  } catch (err) {
    next(err);
  }
};

// // The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    const newMember = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    const passHash = bcrypt.hashSync(newMember.password, 8);

    const hashMember = {
      name: newMember.name,
      email: newMember.email,
      password: passHash,
    };
    const insertId = await memberRepository.create(hashMember);

    /*je creer une nouvelle variable (ID de la table member qui s'auto-incrémente) donc elle crée un nouvel utilisateur dans la BD et récupére
     directement les infos et continuer en temps que membre VIA le next(). */

    const memberSignUp = await memberRepository.read(insertId);

    req.user = memberSignUp; // Lien SignUp vers la connection Login
    next(); // on bascule sur la prochaine etape.
  } catch (err) {
    next(err);
  }
};

// RequestHandler = Typage de gestion de requete. Async doit etre toujour etre accompagné de await.

const login: RequestHandler = async (req, res, next) => {
  try {
    //req.user pour se connecter directement après inscription
    const user = req.user || (await memberRepository.login(req.body.email));
    if (user) {
      const isPasswordValid = bcrypt.compareSync(
        req.body.password,
        user.password,
      );

      if (!isPasswordValid) {
        res.status(401).send("mot de passe incorrect");
        return;
      }

      const token = jwt.sign(
        { id: user.id, isAdmin: user.admin },
        process.env.JWT_SECRET as string,
      );

      res.status(201).json({ token, userId: user.id, isAdmin: user.admin });
    } else {
      res.status(401).send("Email ou mot de passe incorrect");
    }
  } catch (err) {
    next(err);
  }
};

const deleteAccount: RequestHandler = async (req, res, next) => {
  try {
    // On récupère l'ID du membre à supprimer depuis les paramètres de la requête ou depuis le token
    const memberId = req.params.id ? Number(req.params.id) : Number(req.userId);
    // Si l'ID est dans les paramètres, on le prend, sinon on prend l'ID du token
    // On vérifie si l'utilisateur a le droit de supprimer le compte
    // Si l'ID est dans les paramètres et qu'il ne correspond pas à l'ID du token, on refuse l'action
    if (req.params.id && memberId !== Number(req.userId)) {
      res.status(403).json({ message: "Action interdite" });
      return;
    }
    const deleted = await memberRepository.delete(memberId);
    if (!deleted) {
      res.status(404).json({ message: "Utilisateur introuvable" });
      return;
    }
    res.status(200).json({ message: "Compte supprimé avec succès" });
  } catch (err) {
    next(err);
  }
};

const deleteMemberAsAdmin: RequestHandler = async (req, res, next) => {
  try {
    // On récupère l'ID du membre à supprimer depuis les paramètres de la requête
    const MemberId = req.query.idToDelete;
    const adminId = Number(req.params.id);
    // Si l'ID est dans les paramètres, on le prend, sinon on prend l'ID du token
    // On vérifie si l'utilisateur a le droit de supprimer le compte
    // Si l'ID est dans les paramètres et qu'il ne correspond pas à l'ID du token, on refuse l'action
    if (!adminId) {
      res.status(403).json({ message: "Action interdite" });
      return;
    }
    // if (!MemberId || isNaN(Number(MemberId))) {
    //   res.status(400).json({ message: "idToDelete invalide" });
    //   return;
    // }
    const deleted = await memberRepository.delete(Number(MemberId));
    if (!deleted) {
      res.status(404).json({ message: "Utilisateur introuvable" });
      return;
    }
    res.status(200).json({ message: "Compte supprimé avec succès" });
  } catch (err) {
    next(err);
  }
};

//Securité Permettant de contrôler si l'ID est bien associé au token
const checkId: RequestHandler = async (req, res, next) => {
  try {
    const user = await memberRepository.read(Number(req.userId));

    if (user == null) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err) {
    next(err);
  }
};

const editMember: RequestHandler = async (req, res, next) => {
  try {
    const memberId = Number(req.userId);
    const { name, email, password } = req.body;
    const updated = await memberRepository.update(memberId, {
      name,
      email,
      password: password || undefined,
    });
    if (!updated) res.status(404).json({ message: "Utilisateur introuvable" });
    res.status(200).json(updated);
    return;
  } catch (err) {
    next(err);
  }
};

const readFavorite: RequestHandler = async (req, res, next) => {
  try {
    const memberId = Number(req.params.id);
    const favorites = await memberRepository.favoriteList(memberId);

    if (favorites == null) {
      res.sendStatus(404);
    } else {
      res.json(favorites);
    }
  } catch (err) {
    next(err);
  }
};

const readCommented: RequestHandler = async (req, res, next) => {
  try {
    const memberId = Number(req.params.id);
    const favorites = await memberRepository.commentedList(memberId);

    if (favorites == null) {
      res.sendStatus(404);
    } else {
      res.json(favorites);
    }
  } catch (err) {
    next(err);
  }
};

const readMemberProfile: RequestHandler = async (req, res, next) => {
  try {
    const memberId = Number(req.params.id);
    const favorites = await memberRepository.profileMember(memberId);

    if (favorites == null) {
      res.sendStatus(404);
    } else {
      res.json(favorites);
    }
  } catch (err) {
    next(err);
  }
};

const readRegisteredList: RequestHandler = async (req, res, next) => {
  try {
    const memberId = Number(req.params.id);
    const registered = await memberRepository.registeredList(memberId);

    if (registered == null) {
      res.sendStatus(404);
    } else {
      res.json(registered);
    }
  } catch (err) {
    next(err);
  }
};

const UpdateAdminStatus: RequestHandler = async (req, res, next) => {
  try {
    const memberId = Number(req.params.id);
    const { admin } = req.body;
    if (typeof admin !== "boolean") {
      res.status(400).json({
        message: "Le champ 'admin' est requis et doit être un booléen.",
      });
      return;
    }

    const updated = await memberRepository.updateAdminStatus(memberId, admin);
    if (!updated) {
      res.status(404).json({ message: "Utilisateur introuvable" });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export default {
  browse,
  read,
  add,
  login,
  checkId,
  deleteAccount,
  deleteMemberAsAdmin,
  editMember,
  readFavorite,
  readRegisteredList,
  readCommented,
  readMemberProfile,
  UpdateAdminStatus,
};
