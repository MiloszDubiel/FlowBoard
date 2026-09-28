import { FieldError } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { projectColors } from "@/lib/colors";

export const ProjectForm = ({
  open,
  onOpenChange,
  onSubmit,
  handleSubmit,
  register,
  errors,
  isPending,
  type,
}: any) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            {type == "edit" ? "Edytuj projekt" : "Stwórz projekt"}
          </DialogTitle>
          <DialogDescription>
            {type == "edit"
              ? null
              : "Utwórz projekt, aby zorganizować swoją pracę"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="project-name">Nazwa projektu</Label>

            <Input
              id="project-name"
              placeholder="np. Website redesign"
              {...register("name")}
              disabled={isPending}
              autoFocus
            />

            <FieldError errors={[errors.name]} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Opis</Label>

            <Textarea
              id="project-description"
              placeholder="O czym jest ten projekt?"
              {...register("description")}
              disabled={isPending}
              rows={4}
            />

            <FieldError errors={[errors.description]} />
          </div>

          <div className="space-y-3">
            <Label>Kolor projektu</Label>

            <div className="flex flex-wrap gap-3">
              {projectColors.map((color) => (
                <label key={color.value} className="relative cursor-pointer">
                  <input
                    type="radio"
                    value={color.value}
                    {...register("color")}
                    disabled={isPending}
                    className="peer sr-only"
                  />

                  <span
                    className="block size-9 rounded-full border-2 border-transparent transition-all peer-checked:scale-110 peer-checked:border-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2"
                    style={{ backgroundColor: color.color }}
                  />
                </label>
              ))}
            </div>

            <FieldError errors={[errors.color]} />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="cursor-pointer"
            >
              Anuluj
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer"
            >
              Zapisz
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
