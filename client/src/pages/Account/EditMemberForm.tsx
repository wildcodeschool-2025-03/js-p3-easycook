import { useUser } from "@/context/UserContext";

function EditMemberForm() {
  const { user, handleChange, handleUpdateMember, handleDeleteSelfAccount } =
    useUser();

  return (
    <>
      <form onSubmit={handleUpdateMember} className="mx-2 pb-5 lg:w-1/2">
        <fieldset className="border-2 px-5 pb-5 rounded-2xl border-secondary">
          <legend className="text-2xl px-1 font-bold mb-6 text-center text-secondary">
            Modifier mon compte
          </legend>
          <div className="mb-4">
            <label htmlFor="name" className="block text-secondary mb-1">
              Nom
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Laissez vide pour ne pas changer"
              value={user.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-secondary"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-secondary mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Laissez vide pour ne pas changer"
              value={user.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-secondary"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-secondary mb-1">
              Nouveau mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Laissez vide pour ne pas changer"
              value={user.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-secondary"
            />
          </div>
        </fieldset>
        <section className="mt-10 flex lg:flex-row flex-col justify-between">
          <button
            type="submit"
            className=" p-4 mb-4 rounded-xl text-white font-semibold bg-green-600 hover:bg-green-700 curose-pointer"
          >
            Valider les modifications
          </button>
          <button
            type="button"
            onClick={handleDeleteSelfAccount}
            className=" p-4 mb-4 rounded-xl bg-red-600 hover:bg-red-700 font-semibold text-white cursor-pointer"
          >
            Supprimer mon compte
          </button>
        </section>
      </form>
    </>
  );
}

export default EditMemberForm;
