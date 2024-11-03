import { z } from "zod";
import {
  Button,
  Divisor,
  ErrorMessage,
  Fieldset,
  Form,
  FormContainer,
  Input,
  InputMask,
  Label,
  Titulo,
  UploadDescription,
  UploadIcon,
  UploadInput,
  UploadLabel,
  UploadTitulo,
} from "../../components";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";


const esquemaEspecialistaEndereco = z.object({
  endereco: z.object({
    avatar: z.instanceof(FileList).transform((lista) => lista.item(0)),
    cep: z.string().min(8, "O campo CEP é obrigatório"),
    rua: z.string().min(1, "O campo Rua é obrigatório"),
    bairro: z.string().min(1, "O campo Bairro é obrigatório"),
    numero: z.coerce.number().min(1, "O campo Número é obrigatório"),
    localidade: z.string().min(1, "O campo Cidade é obrigatório"),
  })
})

type FormEspecialistaEndereco = z.infer<typeof esquemaEspecialistaEndereco>

type DadosCepProsp = {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

const CadastroEspecialistaEndereco = () => {

  const { register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control
  } = useForm<FormEspecialistaEndereco>({
    resolver: zodResolver(esquemaEspecialistaEndereco),
    mode: "all",
    defaultValues: {
      endereco: {
        avatar: new File([""], "avatar.png", { type: "image/png/jpeg" }),
        cep: "",
        rua: "",
        bairro: "",
        numero: 0,
        localidade: "",
      }
    }
  })

  const aoSubmit = (dados: FormEspecialistaEndereco) => {
    console.log(dados);
  }

  const handleSetDados = useCallback((dados: DadosCepProsp) => {
    setValue("endereco.rua", dados.logradouro)
    setValue("endereco.bairro", dados.bairro)
    setValue("endereco.localidade", dados.localidade + ", " + dados.uf)
  }, [setValue])

  const buscarEndereco = useCallback(async (cep: string) => {
    try {
      const result = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const dados: DadosCepProsp = await result.json();
      if (dados.erro) {
        alert("Cep inválido")
        return;
      }
      handleSetDados(dados)

    } catch (error) {
      console.error(error)
    }
  }, [handleSetDados])

  const cepDigitado = watch("endereco.cep");

  useEffect(() => {
    if (!/^\d{5}-\d{3}$/.test(cepDigitado)) return;
    console.log(cepDigitado)
    buscarEndereco(cepDigitado)
  }, [buscarEndereco, cepDigitado])

  return (
    <>
      <Titulo className="titulo">Para finalizar, só alguns detalhes!</Titulo>
      <Form onSubmit={handleSubmit(aoSubmit)}>
        <>
          <UploadTitulo>Sua foto</UploadTitulo>
          <UploadLabel htmlFor="campo-upload">
            <UploadIcon />
            <UploadDescription>Clique para enviar</UploadDescription>
            <UploadInput
              accept="image/*"
              id="campo-upload"
              type="file"
              {...register("endereco.avatar")}
            />
            {errors.endereco?.avatar &&
              <ErrorMessage>
                {errors.endereco?.avatar.message}
              </ErrorMessage>}
          </UploadLabel>
        </>

        <Divisor /> 
        <Controller
          name="endereco.cep"
          control={control}
          render={({ field }) => (
            <Fieldset>
              <Label htmlFor="campo-cep">CEP</Label>
              <InputMask
                mask={"99999-999"}
                id="campo-cep"
                placeholder="Insira seu CEP"
                type="text"
                $error={!!errors.endereco?.cep}
                {...field}
              />
              {errors.endereco?.cep && <ErrorMessage>{errors.endereco.cep.message}</ErrorMessage>}
            </Fieldset>
          )}
        />
        <Fieldset>
          <Label htmlFor="campo-rua">Rua</Label>
          <Input
            id="campo-rua"
            placeholder="Rua Agarikov"
            type="text"
            $error={!!errors.endereco?.rua}
            {...register("endereco.rua")}
          />
          {errors.endereco?.rua && <ErrorMessage>{errors.endereco.rua?.message}</ErrorMessage>}
        </Fieldset>

        <FormContainer>
          <Fieldset>
            <Label htmlFor="campo-numero-rua">Número</Label>
            <Input
              id="campo-numero-rua"
              placeholder="Ex: 1440"
              type="text"
              $error={!!errors.endereco?.numero}
              {...register("endereco.numero")}
            />
            {errors.endereco?.numero && <ErrorMessage>{errors.endereco?.numero?.message}</ErrorMessage>}
          </Fieldset>
          <Fieldset>
            <Label htmlFor="campo-bairro">Bairro</Label>
            <Input
              id="campo-bairro"
              placeholder="Vila Mariana"
              type="text"
              $error={!!errors.endereco?.bairro}
              {...register("endereco.bairro")}
            />

            {errors.endereco?.bairro && <ErrorMessage>{errors.endereco?.bairro?.message}</ErrorMessage>}
          </Fieldset>
        </FormContainer>
        <Fieldset>
          <Label htmlFor="campo-localidade">Localidade</Label>
          <Input
            id="campo-localidade"
            placeholder="São Paulo, SP"
            type="text"
            $error={!!errors.endereco?.localidade}
            {...register("endereco.localidade")}
          />

          {errors.endereco?.localidade && <ErrorMessage>{errors.endereco?.localidade.message}</ErrorMessage>}
        </Fieldset>
        <Button type="submit">Cadastrar</Button>
      </Form>
    </>
  );
};

export default CadastroEspecialistaEndereco;
