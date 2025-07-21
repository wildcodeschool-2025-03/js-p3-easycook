import type { TypeForm } from "@/types/TypeFiles";
import emailjs from "@emailjs/browser";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function Contact_Form() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TypeForm>();

  const onSubmit = async (data: TypeForm) => {
    try {
      // eMailJS + success Toast

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          user_name: data.name,
          user_lastname: data.lastname,
          user_email: data.email,
          message: data.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      toast.success("Message envoyé avec succès", {
        style: { background: "#452a00", color: "#fde9cc" },
      });
      reset();
    } catch (error) {
      toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto py-10 px-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mt-2 space-y-3">
            <div className="space-y-2">
              <input
                type="text"
                id="name"
                {...register("name", {
                  required: "Nom requis",
                  minLength: {
                    value: 2,
                    message: "Le nom doit comporter au moins 2 caractères",
                  },
                })}
                className="w-full rounded-md border border-primary px-3 py-2 text-secondary "
                placeholder="Nom"
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && (
                <p role="alert" className="">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <input
                type="text"
                id="lastname"
                {...register("lastname", {
                  required: "Prenom requis",
                  minLength: {
                    value: 2,
                    message: "Le Prenom doit comporter au moins 2 caractères",
                  },
                })}
                className="w-full rounded-md border border-primary px-3 py-2 text-secondary focus:bg-[#fde9cc]"
                placeholder="Prenom"
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.lastname && (
                <p role="alert" className="">
                  {errors.lastname.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Email est requis",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email non valide",
                  },
                })}
                className="w-full rounded-md border border-primary px-3 py-2 text-secondary focus:bg-[#fde9cc]"
                placeholder="Votre email"
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p role="alert" className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <textarea
              id="message"
              {...register("message", {
                required: "Message est requis",
                minLength: {
                  value: 10,
                  message: "Le message doit comporter au moins 10 caractères",
                },
              })}
              className="w-full rounded-md border border-primary px-3 py-2 text-secondary focus:bg-[#fde9cc]"
              placeholder="Message"
              rows={6}
              aria-invalid={errors.message ? "true" : "false"}
            />
            {errors.message && (
              <p role="alert" className="text-sm">
                {errors.message.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 md:flex md:justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto px-4 py-2 bg-primary text-white rounded-full hover:bg-orange-500"
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer"}
          </button>
        </div>
      </form>
    </>
  );
}

export default Contact_Form;
