"use client";

import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

interface ContactFormPrefill {
  projectType?: string;
  projectSummary?: string;
  budget?: string;
}

interface ContactFormProps {
  initialValues?: ContactFormPrefill;
}

const normalize = (value?: string) => value?.trim() ?? "";

export default function ContactForm({ initialValues }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: normalize(initialValues?.projectType),
    projectSummary: normalize(initialValues?.projectSummary),
    budget: normalize(initialValues?.budget)
  });

  useEffect(() => {
    const projectType = normalize(initialValues?.projectType);
    const projectSummary = normalize(initialValues?.projectSummary);
    const budget = normalize(initialValues?.budget);

    if (!projectType && !projectSummary && !budget) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      projectType: projectType || prev.projectType,
      projectSummary: projectSummary || prev.projectSummary,
      budget: budget || prev.budget
    }));
  }, [initialValues?.projectType, initialValues?.projectSummary, initialValues?.budget]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Error al enviar el formulario");
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        projectType: "",
        projectSummary: "",
        budget: ""
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setError("Error al enviar tu consulta. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="p-4 bg-ember/20 border border-ember rounded-lg">
          <p className="text-sm text-bone">
            ¡Gracias por tu consulta! Te responderemos en un plazo máximo de dos días hábiles.
          </p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg">
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Input
          label="Nombre completo"
          type="text"
          name="name"
          placeholder="Tu nombre"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Correo electrónico"
          type="email"
          name="email"
          placeholder="tu@empresa.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <Input
        label="Tipo de proyecto"
        type="text"
        name="projectType"
        placeholder="Ej.: Comercial, videoclip, sesión de producto"
        value={formData.projectType}
        onChange={handleChange}
      />

      <Textarea
        label="Resumen del proyecto"
        name="projectSummary"
        placeholder="Cuéntanos tu visión, alcance, calendario y cualquier requisito clave..."
        rows={6}
        value={formData.projectSummary}
        onChange={handleChange}
        required
      />

      <Input
        label="Rango de presupuesto (opcional)"
        type="text"
        name="budget"
        placeholder="Ej.: 5.000 € - 15.000 €"
        value={formData.budget}
        onChange={handleChange}
      />

      <div className="flex items-start gap-3 pt-4 border-t border-white/10">
        <input
          type="checkbox"
          id="agree"
          className="mt-1 w-4 h-4 rounded accent-ember"
          required
        />
        <label htmlFor="agree" className="text-xs text-fog/80">
          Al enviar este formulario, aceptas nuestras prácticas de privacidad. Solo te contactaremos para responder a esta consulta.
        </label>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar consulta"}
        </Button>
      </div>
    </form>
  );
}
