"use client";
/*
 * Documentation:
 * Default Page Layout — https://app.subframe.com/8fbe3cdb8345/library?component=Default+Page+Layout_a57b1c43-310a-493f-b807-8cc88e2452cf
 * Topbar with center search — https://app.subframe.com/8fbe3cdb8345/library?component=Topbar+with+center+search_3bd79561-0143-4651-931b-3b7260b0b798
 * Text Field — https://app.subframe.com/8fbe3cdb8345/library?component=Text+Field_be48ca43-f8e7-4c0e-8870-d219ea11abfe
 * Button — https://app.subframe.com/8fbe3cdb8345/library?component=Button_3b777358-b86b-40af-9327-891efc6826fe
 * Dropdown Menu — https://app.subframe.com/8fbe3cdb8345/library?component=Dropdown+Menu_99951515-459b-4286-919e-a89e7549b43b
 * Avatar — https://app.subframe.com/8fbe3cdb8345/library?component=Avatar_bec25ae6-5010-4485-b46b-cf79e3943ab2
 */

import React from "react";
import * as SubframeUtils from "../utils";
import { TopbarWithCenterSearch } from "../components/TopbarWithCenterSearch";
import { TextField } from "../components/TextField";
import { FeatherSearch } from "@subframe/core";
import { Button } from "../components/Button";
import { FeatherPlusCircle } from "@subframe/core";
import { DropdownMenu } from "../components/DropdownMenu";
import { FeatherUser } from "@subframe/core";
import { FeatherSettings } from "@subframe/core";
import { FeatherLogOut } from "@subframe/core";
import * as SubframeCore from "@subframe/core";
import { Avatar } from "../components/Avatar";

interface DefaultPageLayoutRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

const DefaultPageLayoutRoot = React.forwardRef<
  HTMLDivElement,
  DefaultPageLayoutRootProps
>(function DefaultPageLayoutRoot(
  { children, className, ...otherProps }: DefaultPageLayoutRootProps,
  ref
) {
  return (
    <div
      className={SubframeUtils.twClassNames(
        "flex h-screen w-full flex-col items-center",
        className
      )}
      ref={ref}
      {...otherProps}
    >
      <TopbarWithCenterSearch
        leftSlot={
          <>
            <img
              className="h-6 flex-none object-cover"
              src="https://res.cloudinary.com/subframe/image/upload/v1744062440/uploads/9071/tgxicxlty0tr6ealp9y4.svg"
            />
            <div className="flex items-center gap-2">
              <TopbarWithCenterSearch.NavItem selected={true}>
                Home
              </TopbarWithCenterSearch.NavItem>
              <TopbarWithCenterSearch.NavItem>
                Experiments
              </TopbarWithCenterSearch.NavItem>
              <TopbarWithCenterSearch.NavItem>
                Reports
              </TopbarWithCenterSearch.NavItem>
            </div>
          </>
        }
        centerSlot={
          <TextField
            className="h-auto grow shrink-0 basis-0"
            variant="filled"
            label=""
            helpText=""
            icon={<FeatherSearch />}
          >
            <TextField.Input placeholder="Search" />
          </TextField>
        }
        rightSlot={
          <>
            <Button
              className="hidden"
              variant="neutral-tertiary"
              icon={<FeatherPlusCircle />}
            >
              New
            </Button>
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <Avatar image="https://res.cloudinary.com/subframe/image/upload/v1744373058/uploads/9071/cvp1painz49oeovicmpv.png">
                  A
                </Avatar>
              </SubframeCore.DropdownMenu.Trigger>
              <SubframeCore.DropdownMenu.Portal>
                <SubframeCore.DropdownMenu.Content
                  side="bottom"
                  align="end"
                  sideOffset={4}
                  asChild={true}
                >
                  <DropdownMenu>
                    <DropdownMenu.DropdownItem icon={<FeatherUser />}>
                      Profile
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon={<FeatherSettings />}>
                      Settings
                    </DropdownMenu.DropdownItem>
                    <DropdownMenu.DropdownItem icon={<FeatherLogOut />}>
                      Log out
                    </DropdownMenu.DropdownItem>
                  </DropdownMenu>
                </SubframeCore.DropdownMenu.Content>
              </SubframeCore.DropdownMenu.Portal>
            </SubframeCore.DropdownMenu.Root>
          </>
        }
      />
      {children ? (
        <div className="flex w-full grow shrink-0 basis-0 flex-col items-start gap-4 overflow-y-auto bg-default-background">
          {children}
        </div>
      ) : null}
    </div>
  );
});

export const DefaultPageLayout = DefaultPageLayoutRoot;
