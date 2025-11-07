import React from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function CustomDialog({
    title,
    description,
    alertMessage,
    triggerText,
    variant = "default",
    confirmText = "Confirm",
    onConfirmFn,
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={variant === "destructive" ? "destructive" : "outline"}
                    className="gap-2"
                >
                    {triggerText}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-sm rounded-2xl shadow-lg">
                <DialogHeader>
                    <DialogTitle className={`text-lg font-semibold ${variant === "default" ? "text-default" : "text-foreground"}`}>
                        {title}
                    </DialogTitle>

                    <DialogDescription className="text-gray-600 dark:text-gray-400 mt-1">
                        {description}
                        {alertMessage && (<p className="mt-2"> {alertMessage} </p>)}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex justify-end gap-3 mt-6">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button
                            variant={variant}
                            onClick={onConfirmFn}
                            className={
                                variant === "destructive"
                            }
                        >
                            {confirmText}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
